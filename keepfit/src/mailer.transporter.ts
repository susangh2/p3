import * as nodemailer from 'nodemailer';

import { env } from './env';

// @Injectable()
// export class EmailService {
//   // ...
// }
const transporter = nodemailer.createTransport({
  service: 'hotmail.com',
  host: 'smtp.hotmail.com',
  auth: {
    user: env.EMAIL_ADDRESS,
    pass: env.EMAIL_PASSWORD,
  },
});

export { transporter };
