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
      const newUser = await this.createOne({
        email,
        created_date: this.nowUTC(),
        registration_expires: this.oneHourFromNow(),
      });

      return newUser;
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

    const res = await this.readOne({ _id: params.email }, { _id: 0, themes: 1 });
    return res;
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
    // push new theme obj to user theme key
    const { acknowledged, matchedCount } = await this.updateOne(
      { _id: params.email },
      { $addToSet: { themes: { _id: params.theme, words: [], dateCreated: new Date() } } }
    );

    return acknowledged && matchedCount == 1 && 202;
  }

  async createThemeValue(params) {
    if (!params.email || !params?.theme || !params?.value) {
      throw new Error('cannot call User.createThemeValue without email, theme, or value');
    }

    const findPersonTheme = { _id: params.email, 'themes._id': params.theme };
    const pushThemeVal = { $push: { 'themes.$.words': params.value } };
    let updated = await this.updateOne(findPersonTheme, pushThemeVal);
    console.log('updated');
    console.log(updated);
  }

  async editThemeValue(params) {
    if (!params.email || !params?.theme || !params?.value) {
      throw new Error('cannot call User.editThemeValue without email, theme, or value');
    }

    // EDIT an existing theme value string...hmm...
    // in { _id: email, themes: [...{themeHere}...] }
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

    // NOPE - not yet :/
    const { acknowledged, matchedCount } = await this.collection.updateOne(
      {
        _id: params.email,
      },
      {
        $pull: {
          themes: {
            $elemMatch: {
              _id: params.theme,
              words: {
                $eq: params.value,
              },
            },
          },
        },
      }
    );

    console.log('acknowledged, matchedCount');
    console.log(acknowledged, matchedCount);

    // DELETE an theme value string...
    // in { _id: email, themes: [...{themeHere}...] }
    return false;
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
