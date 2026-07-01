import mongoose, { Schema, model, models } from 'mongoose';

const AdminSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Admin = models.Admin || model('Admin', AdminSchema);
export default Admin;
