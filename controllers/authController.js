import controllerWrapper from '../decorators/controllerWrapper.js';
import authService from '../services/authService.js';
import gravatar from 'gravatar';
import Jimp from 'jimp';
import path from 'path';
import fs from 'fs/promises';
import sendEmail from '../helpers/sendEmail.js';

const { BASE_URL } = process.env;

const sendVerifyEmail = async ({ email, verificationToken }) => {
  const verifyEmail = {
    to: email,
    subject: 'Email verification',
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click to verify email</a>`,
  };

  return await sendEmail(verifyEmail);
};

const resendVerifyEmail = controllerWrapper(async (req, res) => {
  const { email } = req.body;
  const user = await authService.findOne({ email });
  if (!user) {
    throw HttpError(404, 'User not found');
  }
  if (user.verified) {
    throw HttpError(400, 'Verification has already been passed');
  }
  await sendVerifyEmail(user);

  res.status(200).json({
    message: 'Verification email sent',
  });
});

const verifyEmail = controllerWrapper(async (req, res) => {
  const { verificationToken } = req.params;
  const user = await authService.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, 'User not found');
  }

  await authService.update(user._id, {
    verified: true,
    verificationToken: '',
  });

  res.status(200).json({
    message: 'Verification successful',
  });
});

const register = controllerWrapper(async (req, res) => {
  const { email, subscription, avatarURL, verificationToken } =
    await authService.register({
      ...req.body,
      avatarURL: gravatar.url(req.body.email),
    });

  await sendVerifyEmail({ email, verificationToken });

  res.status(201).json({
    user: {
      email,
      subscription,
      avatarURL: generatedAvatar,
    },
  });
});

const login = controllerWrapper(async (req, res) => {
  const user = await authService.login(req.body);
  const { token, verified, email, subscription, avatarURL } = user;

  if (!verified) {
    throw HttpError(401, 'Please verify your email');
  }
  res.status(200).json({
    token,
    user: {
      email,
      subscription,
      avatarURL,
    },
  });
});

const logout = controllerWrapper(async (req, res) => {
  await authService.logout(req.user._id);
  res.status(204).send();
});

const update = controllerWrapper(async (req, res) => {
  const { user, body } = req;
  const { email, subscription, avatarURL } = await authService.update(
    user._id,
    body
  );
  res.status(200).json({
    email,
    subscription,
    avatarURL,
  });
});

const current = controllerWrapper(async (req, res) => {
  const { email, subscription, avatarURL } = req.user;
  res.status(200).json({
    email,
    subscription,
    avatarURL,
  });
});

const updateAvatar = controllerWrapper(async (req, res) => {
  if (!req.file) {
    throw new Error('No file attached');
  }
  const { _id } = req.user;
  const { path: tmpPath, filename } = req.file;
  const avatarsDir = path.resolve('public', 'avatars');
  const avatarURL = path.join(avatarsDir, filename);
  await fs.rename(tmpPath, avatarURL);
  await resizeAvatar(avatarURL);
  await authService.update(_id, { avatarURL });

  res.status(200).json({
    avatarURL,
  });
});

const resizeAvatar = async avatarPath => {
  const avatar = await Jimp.read(avatarPath);
  await avatar.resize(250, 250).writeAsync(avatarPath);
};

export default {
  register,
  login,
  logout,
  update,
  updateAvatar,
  current,
  verifyEmail,
  resendVerifyEmail,
};
