import controllerWrapper from '../decorators/controllerWrapper.js';
import authService from '../services/authService.js';
import gravatar from 'gravatar';
import Jimp from 'jimp';
import path from 'path';

const register = controllerWrapper(async (req, res) => {
  const { email, subscription } = await authService.register({
    ...req.body,
    avatarURL: gravatar.url(req.body.email),
  });

  res.status(201).json({
    user: {
      email,
      subscription,
      avatarURL,
    },
  });
});

const login = controllerWrapper(async (req, res) => {
  const { token, email, subscription, avatarURL } = await authService.login(
    req.body
  );
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
  const avatarPath = path.join(avatarsDir, filename);
  await resizeAvatar(tmpPath, avatarPath);
  const avatarURL = path.join('avatars', filename);
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
};
