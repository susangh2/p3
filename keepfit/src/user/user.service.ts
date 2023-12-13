import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from 'nest-knexjs';
import { NotFoundError } from 'rxjs';
import { Knex } from 'knex';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { ProfileDto } from './dto/profile.dto';
import { string } from 'cast.ts';
import { DAY } from '@beenotung/tslib/time';
import { TimezoneDate } from 'timezone-date.ts';
import { transporter } from '../mailer.transporter';
import * as crypto from 'crypto';
import { env } from 'src/env';
// import { Transporter } from 'nodemailer';

@Injectable()
export class UserService {
  resetTokenRepository: any;
  registration(users: {
    username: string;
    email: string;
    password: string;
    sex: string;
    birthday: Date;
    height: string;
    weight: string;
    idealWeight: string;
    activeLevel: string;
  }) {
    throw new Error('Method not implemented.');
  }
  constructor(@InjectModel() private readonly knex: Knex) {}

  async login(user: { username: string; password: string }) {
    let userInfo1 = await this.knex
      .select('*')
      .from('users')
      .where('username', user.username);
    console.log({ userInfo1 });

    if (userInfo1.length === 0) {
      throw new NotFoundException('user not found');
    }

    this.validateUserPassword(user, userInfo1[0].hash_password);

    return userInfo1[0].id as number;
  }

  async checkUsernameExists(username: string): Promise<boolean> {
    const count = await this.knex
      .table('users')
      .where('username', username)
      .count('id')
      .first();

    return count && count['count'] > 0;
  }

  async checkEmailExists(email: string): Promise<boolean> {
    const count = await this.knex
      .table('users')
      .where('email', email)
      .count('id')
      .first();

    return count && count['count'] > 0;
  }

  async register(users: RegisterDto) {
    const {
      username,
      email,
      password,
      sex,
      birthday,
      height,
      weight,
      idealWeight,
      activeLevel,
    } = users;

    const hashedPassword = await bcrypt.hash(password, 10);
    const registeredUser = await this.knex

      .table('users')
      .insert({
        username,
        email,
        hash_password: hashedPassword,
        sex,
        birthday,
        height,
        weight,
        ideal_weight: idealWeight,
        active_level_id: activeLevel,
        // face: 'face',
      })
      .returning('id');
    console.log('aaa:', registeredUser);

    return registeredUser[0].id;
  }
  private validateUserPassword(
    user: { username: string; password: string },
    storedHashedPassword: string,
  ) {
    const passwordMatch = bcrypt.compareSync(
      user.password,
      storedHashedPassword,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('Password does not match');
    }
  }

  async updateProfile(userId: number, profile: ProfileDto) {
    await this.knex('users').where('id', userId).update(profile);
    return {};
  }

  // async findByEmail(email: string) {
  //   return this.knex('users').where('email', email).first();

  //   let tokenModel = await this.createForgotPasswordToken(email)

  //   if (tokenModel && tokenModel.newPassword(Token)) {
  //     let transporter = nodemailer.createTransport({
  //       host: config.mail.host,
  //       auth:{
  //         user: config.mail.host,
  //         auth:{
  //           user: config.mail.user,
  //           pass: CountQueuingStrategy.mail.pass
  //       }
  //     })
  //     let mailOptions ={
  //       from: config.mail.user
  //       to: email,
  //       subject: "Forgotten Password",
  //       text: "Forgot Password",
  //       html:
  //       "Hi! <br><br> If you requested to reset your password<br><br>"+
  //       "a href='congig.host.url+
  //       ":" +
  //       config.host.port +
  //       "/auth/email/reset-password/"+
  //       tokenModel.newPasswordToken +
  //       ">Click here</a>"
  //     };

  // }

  // async saveResetToken(userId: string, token: string) {
  //   return this.resetTokenRepository.saveResetToken(userId, token);
  // }

  // async findByResetToken(token: string) {
  //   return this.resetTokenRepository.findByToken(token);
  // }

  //   async updatePassword(userId: string, newPassword: string) {
  //     const hashedPassword = await bcrypt.hash(newPassword, 10);
  //     return this.knex('users')
  //       .where('id', userId)
  //       .update({ password: hashedPassword });
  //   }

  //   async createForgotPasswordToken(
  //     email: string
  //   ): Promise<ForgottenPassword>{
  //       let forgottenPassword = await this forgottenPasswordModel.findOne({
  //         email: email
  //       });
  //     if(forgottenPassword &&
  //       (new Date().getTime() - forgottenPassword.timestamp.getTime()) / 60000 < 15

  //   ){
  //     throw new HttpException(
  //       "Reset password email sended recently",
  //       HttpStatus.INTERNAL_SERVER_ERROR
  //     );
  //   } else{
  //     let forgottenPasswordModel = await this.forgottenPasswordModel.findOneAndUpdate(
  //       {email: email},
  //       {
  //         email: email,
  //         newPasswordToken: (
  //           Math.floor(Math.random() * 9000000) + 1000000
  //         ).toString(),
  //         timestamp: new Date()
  //       },
  //       {upsert: true, new: true}
  //     );
  //     if (forgottenPasswordModel){
  //       return forgottenPasswordModel;
  //   }else{
  //     throw new HttpException(
  //       "login error generic error",
  //       HttpStatus.INTERNAL_SERVER_ERROR
  //     );
  //   }
  // }
  //   }
  // async clearResetToken(userId: string) {
  //   return this.resetTokenRepository.clearResetToken(userId);
  // }

  // async sendResetPasswordEmail(email: string, resetLink: string) {
  //   // Implement your email sending logic here
  //   // Example code using a mail service or library:
  //   await this.mailService.sendEmail({
  //     to: email,
  //     subject: 'Reset Password',
  //     body: `Click the following link to reset your password: ${resetLink}`,
  //   });
  // }

  async getProfile(userId: number) {
    const result = await this.knex('users')
      .select(
        'username',
        'email',
        'sex',
        'birthday',
        'height',
        'weight',
        'active_level_id',
        'ideal_weight',
      )
      .leftJoin('active_level', 'users.active_level_id', 'active_level.id')
      .where('users.id', userId);
    if (result.length === 0) {
      throw new NotFoundException('User not found');
    }

    const userData = result[0];
    return userData;
  }

  async getActiveLevel() {
    let activeLevelList = await this.knex('active_level').select(
      'id',
      'active_level',
    );
    return activeLevelList;
  }

  async getUserTarget(userId: number) {
    const userTarget = await this.knex('users')
      .select(
        'weight',
        'ideal_weight',
        'active_level',
        'active_level_id',
        'sex',
      )
      .leftJoin('active_level', 'users.active_level_id', 'active_level.id')
      .where('users.id', userId)
      .first();
    if (!userTarget) {
      throw new NotFoundException('User not found');
    }
    const sportsSelection = await this.knex('calories_consumption').select(
      'sport_name',
      'consumption',
    );

    let users_meal_records = await this.knex('users_meal_record')
      .select('food.calories', 'users_meal_record.timestamp')
      .leftJoin('food', 'users_meal_record.food_id', 'food.id')
      .leftJoin('users', 'users.id', 'users_meal_record.user_id')
      .where('users.id', userId)
      .andWhereRaw(
        'users_meal_record.timestamp >= ?',
        new Date(Date.now() - 30 * DAY).toISOString(),
      );
    console.log('users_meal_records:', users_meal_records);
    let totalCalories = 0;
    let days = new Set();
    for (let { calories, timestamp } of users_meal_records) {
      totalCalories += calories;
      let date = new TimezoneDate(timestamp.getTime());
      date.timezone = +8;
      let day = date.getMonth() + 1 + '-' + date.getDate();
      days.add(day);
    }
    console.log({ days, totalCalories });
    let averageDailyCalories = totalCalories / days.size;
    if (!averageDailyCalories) {
      averageDailyCalories = 2250;
    }

    console.log({ userTarget, sportsSelection, averageDailyCalories });

    return { userTarget, sportsSelection, averageDailyCalories };
  }

  async predict(file_path: string) {
    console.log('predict', file_path);
    let res = await fetch('http://127.0.0.1:8000/ai/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ file_path }),
    });
    let json = await res.json();
    console.log('result from python:', json);
    return json;
  }

  async confirmResult(
    body: { foodName: string; fileName: string },
    user_id: number,
  ) {
    let foodName = body.foodName;
    if (body.foodName == 'alldaybreakfast') {
      foodName = 'all day breakfast';
    }
    let fileName = body.fileName;
    let food = await this.knex('food').select('*').where('name', foodName);
    if (!food[0]) {
      throw new NotFoundException('food not found');
    }
    let food_id = food[0].id;

    // let food_id = 2;
    let inserted = await this.knex('users_meal_record').insert({
      user_id: user_id,
      food_id: food_id,
      user_photo_filename: fileName,
      serving_size: 22,
    });

    return { inserted, food };
  }

  // async getUserTarget(userId: number) {
  //   const userTarget = await this.knex('users')
  //     .select(
  //       'users.weight',
  //       'users.ideal_weight',
  //       'users.active_level_id',
  //       'users.sex',
  //       'calories_consumption.sport_name',
  //       'calories_consumption.consumption',
  //     )
  //     .leftJoin('active_level', 'users.active_level_id', 'active_level.id')
  //     .leftJoin(
  //       'calories_consumption',
  //       'users.id',
  //       'calories_consumption.users_id',
  //     )
  //     .where('users.id', userId)
  //     .first();

  //   if (!userTarget) {
  //     throw new NotFoundException('User not found');
  //   }
  //   console.log('the realData', userTarget);
  //   return { userTarget };
  // }

  async getUserMeal(userId: number) {
    // userId = 3;
    const userMeal = await this.knex('users_meal_record')
      .select(
        'users_meal_record.food_id',
        'food.calories',
        'users_meal_record.serving_size',
        'users_meal_record.timestamp',
      )
      .leftJoin('food', 'users_meal_record.food_id', 'food.id')
      .leftJoin('users', 'users.id', 'users_meal_record.user_id')
      .where('users.id', userId);
    if (!userMeal) {
      throw new NotFoundException('User not found');
    }
    return { userMeal };
  }

  async sendPasswordResetEmail(email: string) {
    const user = await this.knex('users').where('email', email).first();

    if (!user) {
      throw new Error('Email not found');
    }

    const resetToken = generateResetToken();
    await this.knex('users').where('email', email).update({ resetToken });

    const resetUrl = `${env.FRONTEND_ORIGIN}/update-password.html?token=${resetToken}`;
    const mailOptions = {
      from: env.EMAIL_ADDRESS,
      to: email,
      subject: 'Password Reset',
      text: `We have received a request to reset your password. If it is you, please open the link below to reset your password:\n${resetUrl}`,
      html: `
    <p>
    We have received a request to reset your password. If it is you, please open the link below to reset your password:\n${resetUrl}
    <br>
    <a href="${resetUrl}"></a>
    </p>
    `,
    };

    await transporter.sendMail(mailOptions);
  }

  async updatePasswordWithToken(token: string, newPassword: string) {
    // Find the user with the provided token in the database
    const user = await this.knex('users').where({ resetToken: token }).first();
    if (!user) {
      throw new NotFoundException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.knex('users')
      .where({ id: user.id })
      .update({ hash_password: hashedPassword, resetToken: null });
  }

  // async findByEmail(email: string): Promise<any> {
  //   return this.knex('users').where({ email }).first();
  // }

  // async createUser(user: any): Promise<any> {
  //   return this.knex('users').insert(user).returning('*');
  // }

  // async googleLogin(profile: any): Promise<any> {
  //   const { email } = profile;
  //   let user = await this.findByEmail(email);

  //   if (!user) {
  //     const newUser = {
  //       email: email,
  //       // Add other properties as needed
  //     };

  //     user = await this.createUser(newUser);
  //   }

  //   return user;
  // }
}
function generateResetToken(): string {
  let token = crypto.randomBytes(16).toString('hex');

  return token;
}
// function createForgotPasswordToken(
//   email: string,
//   string: (
//     options?:
//       | (import('cast.ts').StringOptions &
//           import('cast.ts').CustomSampleOptions<string>)
//       | undefined,
//   ) => {
//     sampleValue: string;
//     randomSample: () => string;
//     parse: (
//       input: unknown,
//       context?: import('cast.ts').ParserContext | undefined,
//     ) => string;
//     options: import('cast.ts').StringOptions &
//       import('cast.ts').CustomSampleOptions<string>;
//     type: string;
//   },
// );

// {
//   throw new Error('Function not implemented.');
// }
