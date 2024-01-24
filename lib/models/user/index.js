import { createHmac, createHash, randomBytes } from 'crypto';
import { Crud } from '../crud/index.js';

class User extends Crud {
  constructor(props) {
    super(props);
    this.registration_exp_duration = 60 * 60 * 1000;
    this.hashType = 'sha512';
    this.duplicate_key_mongo_code = 11000;
    this.isAnEmailString = (str) =>
      String(str)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    this.requestPwReset = () => `User requestPwReset Here`;
    this.temporaryUsers = {};
  }

  async createOne(obj) {
    if (!this.isAnEmailString(obj.email)) {
      throw new Error(`Cannot call User createOne without a valid email address`);
    }
    try {
      const insertObj = {
        _id: obj.email,
        ...obj,
      };

      delete insertObj.email;

      return await this.collection.insertOne(insertObj);
    } catch (e) {
      if (e.code === this.duplicate_key_mongo_code) throw new Error('Cannot Create User');
      throw new Error(e);
    }
  }

  oneHourFromNow() {
    const now = this.nowUTC();
    const nowParsed = Date.parse(now);
    const inOneHour = nowParsed + this.registration_exp_duration;
    return new Date(inOneHour);
  }

  //
  //
  // Auth
  //
  //
  registrationExpired(timeToCheck) {
    const curTime = this.nowUTC();
    return Date.parse(timeToCheck) < Date.parse(curTime) - this.registration_exp_duration;
  }

  async canRegister({ email }) {
    try {
      const canRegisterRes = await this.readOne({
        email,
        canRegister: true,
      });

      console.log('canRegisterRes');
      console.log(canRegisterRes);
      return true;
    } catch (e) {
      console.log('canRegister user Error');
      console.log(e.message);
      console.log(e);
      return false;
    }
  }

  /*
    Allow user-registration (see functionalities/USER_REGISTRATION.md) for more deets
    FIRST STEP in user-registration
    - Create a user account
    - create a registration_expires date
    - create an registration_token or something...
    - send an email to the user with a unique code for them to enter here
  */
  async registerEmail({ email }) {
    if (!this.isAnEmailString(email)) {
      throw new Error(`Cannot call registerEmail without a valid email address`);
    }

    try {
      // const newUser = await this.createOne({
      //   email,
      //   created_date: this.nowUTC(),
      //   registration_expires: this.oneHourFromNow(),
      // });
      // mongo docs

      const selectDoc = { _id: email };
      const updateDoc = [
        {
          $set: {
            created_date: this.nowUTC(),
            registration_expires: this.oneHourFromNow(),
          },
        },
      ];
      return await this.updateOne(selectDoc, updateDoc);
    } catch (e) {
      console.log('userAuth registerEmail Error');
      console.log(e.message);
      console.log(e);
      throw new Error(e);
    }
  }

  hashVal(str) {
    return createHash(this.hashType).update(str).digest('hex');
  }

  saltPw(str) {
    const salt = randomBytes(8).toString('hex');
    let saltedHashed = createHmac('sha256', salt).update(str).digest('hex');
    return { salt, saltedPw: saltedHashed };
  }

  /*
    SECOND STEP in user-registration process
    - check token match
    - check time is before registration_expires date
    - creates create_pw_token or something...

    ALSO
    - used when user "forgets" or wants to "reset" their pw...hmm
  */
  async validateEmail({ email }) {
    if (!this.isAnEmailString(email)) {
      throw new Error(`Cannot call validateEmail without a valid email address`);
    }

    const foundUser = await this.readOne({ _id: email }, { registration_expires: 1 });

    if (!foundUser) return false;

    // check if this is during registration workflow
    if (
      foundUser?.registration_expires &&
      this.registrationExpired(foundUser.registration_expires)
    ) {
      return 'expired';
    }
    return true;
  }

  /*
    Create a pw
    - sets pw field in user
    - sets last_updated
  */
  async setPW(params) {
    if (!params.email || !params.password) {
      throw new Error('cannot call User.setPW without email or pw');
    }

    /*
      - remove registrationExpired field
      - set pw with hashed val
      - set last_updated to now
      - set last_updated_by ?!
    */
    const now = this.nowUTC();
    const newPW = this.hashVal(params.password);

    // mongo docs
    const selectDoc = { _id: params.email };
    const updateDoc = [
      {
        $set: {
          lats_updated: now,
          password: newPW,
        },
      },
      {
        $unset: ['registration_expires'],
      },
    ];

    try {
      return await this.updateOne(selectDoc, updateDoc);
    } catch (e) {
      throw new Error(e);
    }
  }

  async validatePW(params) {
    if (!params.email || !params.password) {
      throw new Error('cannot call User.validatePW without email or pw');
    }

    const userPW = this.hashVal(params.password);
    const res = await this.readOne({ _id: params.email }, { _id: 0, password: 1 });
    return userPW === res.password;
  }

  //
  //
  // Themes
  //
  //
  async setThemes({ email }) {
    if (!email) {
      throw new Error('cannot call User.setThemes without email or pw');
    }
    const rawData = await this.db.collection('Themes').find({});
    const themeData = await rawData.toArray();
    await this.collection.updateOne(
      { _id: email },
      { $set: { themes: themeData.map((d) => ({ ...d, dateCreated: new Date() })) } }
    );
    return true;
  }

  async getTheme(params) {
    if (!params.email) {
      throw new Error('cannot call User.getTheme without email');
    }

    const res = await this.readOne({ _id: params.email }, { _id: 0, themes: 1 });
    return res;
  }

  async getThemes(params) {
    if (!params.email) {
      throw new Error('cannot call User.getThemes without email');
    }

    // themes: sorted by theme word && sorted nested words
    const aggResults = this.collection.aggregate([
      { $match: { _id: params.email } },
      {
        $project: {
          _id: 0,
          themes: {
            $sortArray: {
              input: {
                $map: {
                  input: '$themes',
                  as: 'themesArr',
                  in: {
                    theme: '$$themesArr._id',
                    words: { $sortArray: { input: '$$themesArr.words', sortBy: 1 } },
                  },
                },
              },
              sortBy: { theme: 1 },
            },
          },
        },
      },
    ]);

    let finalRes = [];
    for await (const doc of aggResults) {
      finalRes.push(doc);
    }

    // TODO: clean this up a bit, move into agg pipeline
    return (finalRes && finalRes[0] && finalRes[0].themes) || [];
  }

  async createTheme(params) {
    if (!params.email || !params?.theme) {
      throw new Error('cannot call User.createTHeme without email or theme');
    }

    const found = await this.collection.find({
      _id: params.email,
      themes: { $elemMatch: { _id: params.theme } },
    });

    const cleanerFound = await found.toArray();
    if (cleanerFound[0]?.themes?.find((d) => d._id === params.theme)) {
      console.log('BUG?! tried to create a theme that is already present');
      return 409;
    }

    const words = params?.words ? params.words : [];
    // push new theme obj to user theme key
    const { acknowledged, matchedCount } = await this.updateOne(
      { _id: params.email },
      { $addToSet: { themes: { _id: params.theme, words: words, dateCreated: new Date() } } }
    );

    console.log('createTheme:');

    console.log({
      acknowledged,
      matchedCount,
    });

    return acknowledged && matchedCount == 1 && 201;
  }

  async getSingleTheme(params) {
    const userWithCurrentTheme = await this.collection.aggregate([
      {
        $match: {
          _id: params.email,
        },
      },
      {
        $project: {
          _id: 0,
          theme: {
            $first: {
              $filter: {
                input: '$themes',
                as: 't',
                cond: {
                  $eq: ['$$t._id', params.currentTheme],
                },
              },
            },
          },
        },
      },
      {
        $project: {
          theme: '$theme._id',
          words: '$theme.words',
        },
      },
    ]);
    // const newTheme = {
    //   _id: params.newTheme,
    //   words: userWithCurrentTheme.theme[0].words
    // }
    return userWithCurrentTheme;
  }

  async createThemeValue(params) {
    if (!params.email || !params?.theme || !params?.value) {
      throw new Error('cannot call User.createThemeValue without email, theme, or value');
    }

    const findPersonTheme = { _id: params.email, 'themes._id': params.theme };
    const pushThemeVal = { $addToSet: { 'themes.$.words': params.value } };
    let { acknowledged, modifiedCount } = await this.updateOne(findPersonTheme, pushThemeVal);
    if (acknowledged && modifiedCount === 1) return true;
    return false;
  }

  async editThemeValue(params) {
    if (!params.email || !params?.theme || !params?.value || !params.newValue) {
      throw new Error('cannot call User.editThemeValue without email, theme, value, or newValue');
    }

    try {
      // TODO: update the editing to be in-db-only
      const res = await this.readOne(
        { _id: 'mretfaster@gmail.com', 'themes._id': params.theme },
        { _id: 0, themes: { $elemMatch: { _id: params.theme } } }
      );

      const editableItemIndex = res.themes[0]?.words.indexOf(params.value);
      res.themes[0].words[editableItemIndex] = params.newValue;

      const { modifiedCount, acknowledged } = await this.collection.updateOne(
        { _id: params.email, 'themes._id': params.theme },
        { $set: { 'themes.$.words': res.themes[0].words, 'themes.$.dateModified': new Date() } }
      );
      return acknowledged && modifiedCount == 1;
    } catch (error) {
      console.log('editThemeValue error');
      console.log(error);
      return false;
    }
  }

  async deleteTheme(params) {
    try {
      if (!params.email || !params?.theme) {
        throw new Error('cannot call User.deleteThemeValue without email, theme, or value');
      }

      let { acknowledged, matchedCount } = await this.updateOne(
        { _id: params.email },
        { $pull: { themes: { _id: params.theme } } }
      );

      if (acknowledged && matchedCount == 1) return true;
      else {
        return false;
      }
    } catch (error) {
      console.log('user.deleteTheme ERROR');
      console.log(error);
      return false;
    }
  }

  async deleteThemeValue(params) {
    if (!params.email || !params?.theme || !params?.value) {
      throw new Error('cannot call User.deleteThemeValue without email, theme, or value');
    }

    const { acknowledged, matchedCount } = await this.collection.updateOne(
      {
        _id: params.email,
        'themes._id': params.theme,
      },
      { $pull: { 'themes.$[].words': { $eq: params.value } } }
    );
    return acknowledged && matchedCount == 1;
  }

  /*
    SIMILAR to the "validateEmail" 
      but instead of registration_expires
      use pw_reset_expires
    - sets account_locked
    - set a pw_reset_token
    - set pw_reset_expires
    - sends email with button to reset pw or something?!
  */
  // requestPwReset() {
  //   return `User requestPwReset Here`;
  // }
}

export { User };
