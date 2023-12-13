import {
  Controller,
  Post,
  Body,
  Redirect,
  Request,
  Response,
  Get,
  Req,
  HttpException,
  HttpStatus,
  Session,
  UnauthorizedException,
  UseGuards,
  NotFoundException,
  Param,
  UseInterceptors,
  UploadedFile,
  NotImplementedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { date, number, object, string } from 'cast.ts';
import { RegisterDto } from './dto/register.dto';
import { ProfileDto } from './dto/profile.dto';
// import * as bcrypt from 'bcrypt';
import session from 'express-session';
import { SessionType } from 'src/session';
import { AuthGuard } from 'src/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as path from 'path';
import * as crypto from 'crypto';

let loginParser = object({
  username: string({ nonEmpty: true }),
  password: string({ nonEmpty: true }),
});

// let regParser = object({
//   username: string({ nonEmpty: true }),
//   email: string({ nonEmpty: true }),
//   password: string({ nonEmpty: true }),
//   sex: string({ nonEmpty: true }),
//   birthday: date(),
//   height: number(),
//   weight: number(),
//   idealWeight: number(),
//   activeLevel: string(),
// });

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Redirect()
  @Post('login')
  async login(
    @Body() body: unknown,
    @Request() req: Request,
    @Session() session: SessionType,
  ) {
    try {
      let user = loginParser.parse(body);
      let id = await this.userService.login(user);
      // req.session.user_id = id;
      console.log(id);
      session.user_id = id;
      session.save();
      return { url: '/profile.html?id=' + id };
    } catch (error) {
      return {
        url: '/login.html?' + new URLSearchParams({ error: String(error) }),
      };
    }
  }

  @Post('login-ajax')
  async loginAjax(@Body() body: unknown) {
    let users = loginParser.parse(body);
    return await this.userService.login(users);
  }

  @Post('registration')
  async registration(
    @Body() body: RegisterDto,
    @Session() session: SessionType,
  ) {
    try {
      // let user = regParser.parse(body);
      console.log({ body });
      const isUsernameExists = await this.userService.checkUsernameExists(
        body.username,
      );
      const isEmailExists = await this.userService.checkEmailExists(body.email);

      if (isUsernameExists && isEmailExists) {
        throw new HttpException(
          {
            message: 'Username and email are already registered',
          },
          HttpStatus.BAD_REQUEST,
        );
      } else if (isUsernameExists) {
        throw new HttpException(
          {
            message: 'Username is already registered',
          },
          HttpStatus.BAD_REQUEST,
        );
      } else if (isEmailExists) {
        throw new HttpException(
          {
            message: 'Email is already registered',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const registeredUser = await this.userService.register(body);
      console.log({ url: '/profile.html?id=' + registeredUser });
      // session.user_id = registeredUser;
      // session.save();
      return { url: '/profile.html?id=' + registeredUser };
    } catch (err: any) {
      console.log({ err });

      throw new HttpException(
        {
          message: 'Registration failed',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('profile')
  @UseGuards(AuthGuard)
  async updateProfile(
    @Session() session: SessionType,
    @Body() body: ProfileDto,
  ) {
    if (!session.user_id) throw new UnauthorizedException();
    return await this.userService.updateProfile(session.user_id, body);
    // const user_id = 4;
    // return await this.userService.updateProfile(user_id, body);
  }

  @Post('logout')
  async logout(@Session() session: SessionType): Promise<any> {
    await new Promise<void>(function (resolve, reject) {
      session.destroy((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    return {};
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  async getProfile(@Session() session: SessionType) {
    const user_id = session.user_id;
    // const user_id = 3;
    if (!user_id) throw new UnauthorizedException();
    return await this.userService.getProfile(user_id);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() data: { email: string }) {
    const { email } = data;

    await this.userService.sendPasswordResetEmail(email);
    return { success: true };
  }

  @Post('update-password/:token')
  async updatePassword(
    @Body() data: { newPassword: string },
    @Param('token') token: string,
  ) {
    const { newPassword } = data;
    await this.userService.updatePasswordWithToken(token, newPassword);
    return { success: true };
  }

  @Get('activelevel')
  async getActiveLevel() {
    return await this.userService.getActiveLevel();
    // let result = await this.userService.getActiveLevel();
    // console.log(result);
  }

  @Get('target')
  @UseGuards(AuthGuard)
  async getUserTarget(
    @Request() req: Request,
    @Session() session: SessionType,
  ) {
    const user_id = session.user_id;
    // userId = 6;
    if (!user_id) {
      return { error: 'User not found' };
    }

    // const userId = 1;
    return await this.userService.getUserTarget(user_id);
  }

  @Get('meal')
  @UseGuards(AuthGuard)
  async getUserMeal(@Request() req: Request, @Session() session: SessionType) {
    const user_id = session.user_id;
    if (!user_id) {
      return { error: 'User not found' };
    }

    const userMeals = await this.userService.getUserMeal(user_id);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    let totalCalories = 0;
    for (const meal of userMeals.userMeal) {
      const updatedAt = new Date(meal.timestamp);
      if (updatedAt >= thirtyDaysAgo) {
        totalCalories += meal.calories;
      }
    }
    console.log('bbb,', totalCalories);

    return { totalCalories };
    // return await this.userService.getUserMeal(user_id);
  }

  @Get('role')
  getUserId(@Session() session: SessionType) {
    if (session.user_id) {
      let user_id = session.user_id;
      console.log('getRole:', user_id);
      return { user_id };
    }
    return { role: 'guest' };
  }

  @Post('upload')
  // @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: './public/mealphotos',
        // filename: editFileName,

        filename(req, file, callback) {
          /// 1
          callback(
            null,
            crypto.randomUUID() + '.' + file.mimetype.split('/').pop(),
          );
        },

        // filename(name, ext, part, form) {
        //   return crypto.randomUUID() + '.' + part.mimetype?.split('/').pop();
        // },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Session() session: SessionType,
  ) {
    console.log(file);
    let file_path = path.resolve(file.path);
    let result = await this.userService.predict(file_path);
    console.log('result', result);
    return { result, filename: file.filename };
    // throw new NotImplementedException('TODO');
  }

  @Post('confirmResult')
  async confirmResult(
    @Body() body: { foodName: string; fileName: string },
    @Session() session: SessionType,
  ) {
    const userID = session.user_id;
    // const userID = 2;
    if (!userID) {
      return { error: 'User not found' };
    }
    console.log('confirmedResult called!');
    let confirmedResult = await this.userService.confirmResult(body, userID);

    console.log('returned body', confirmedResult);
    console.log('!!!!returned body id', confirmedResult.food[0].id);
    console.log('insert.row.result', confirmedResult.inserted);
    return { confirmedResult };
  }

  // const user_id = session.user_id;
  // if (!user_id) {
  //   return { error: 'User not found' };
  // }
  // let uploadedFile = this.userService.uploadphoto(file, user_id);

  // filter(part) {
  //   return part.mimetype?.startsWith("image/") || false;
  // },

  // file.filename = file.originalname;
  // const response = {
  //   originalname: file.originalname,
  //   filename: file.filename,
  // };
  // return response;
  // }

  // @Get('uploadphoto')
  // async getPhoto() {
  //   let json = await this.userService.uploadphoto();
  //   console.log(json);
  //   return json;
  // }

  //   @Get('predict')
  // }

  // async dailyConsume(){
  //   if (sex === "male"){
  //     this.calorieShouldBurn- dailyConsumption - 2500
  //   }

  //   if (sex ==="female"){
  //     this.calorieShouldBurn- dailyConsumption - 2000
  //   }
  //   return this.calorieShouldBurn
}
