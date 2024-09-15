import { Schema, model, models } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, 'ユーザー名は必須です'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'メールアドレスは必須です'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'パスワードは必須です'],
  },
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = models.User || model('User', UserSchema);

export default User;