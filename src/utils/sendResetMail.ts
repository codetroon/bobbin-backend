import { User } from "@prisma/client";
import httpStatus from "http-status";
import nodemailer from "nodemailer";
import config from "../config";
import ApiError from "../errors/ApiError";

export const sendResetMail = async (resetLink: string, userInfo: User) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.app_mail,
      pass: config.mail_password,
    },
  });

  const mailOptions = {
    from: config.app_mail,
    to: userInfo.email,
    subject: "Password Reset Request",
    html: `
    <p><b>Click the link below to reset your password:</b></p>
    <p>${resetLink}</p>
    <p>This link will expire in 10 minutes.</p>
  `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
    throw new ApiError(httpStatus.BAD_REQUEST, "Email could not be sent");
  }
};
