import { getDatabase } from '../config/database.js';
import { AdminUser } from '../types/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, config.security.bcryptRounds);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateJWT(payload: { user_id: number; email: string; username: string }): string {
    return jwt.sign(payload, config.security.jwtSecret, {
      expiresIn: '8h'
    });
  }

  static verifyJWT(token: string): any {
    try {
      return jwt.verify(token, config.security.jwtSecret);
    } catch (error) {
      return null;
    }
  }

  static async createAdmin(username: string, email: string, password: string): Promise<AdminUser | null> {
    try {
      const db = getDatabase();
      const passwordHash = await this.hashPassword(password);

      const insert = db.prepare(`
        INSERT INTO admin_users (username, email, password_hash)
        VALUES (?, ?, ?)
      `);

      const result = insert.run(username, email, passwordHash);

      const user = db.prepare('SELECT * FROM admin_users WHERE id = ?').get(result.lastInsertRowid) as AdminUser;

      return user;
    } catch (error) {
      console.error('Error creating admin:', error);
      return null;
    }
  }

  static async login(username: string, password: string): Promise<{ user: AdminUser; token: string } | null> {
    try {
      const db = getDatabase();

      const user = db.prepare('SELECT * FROM admin_users WHERE username = ? OR email = ?').get(username, username) as AdminUser | undefined;

      if (!user) {
        return null;
      }

      const isValidPassword = await this.comparePassword(password, user.password_hash);

      if (!isValidPassword) {
        return null;
      }

      const updateLogin = db.prepare(`
        UPDATE admin_users
        SET last_login = CURRENT_TIMESTAMP
        WHERE id = ?
      `);

      updateLogin.run(user.id);

      const token = this.generateJWT({
        user_id: user.id,
        email: user.email,
        username: user.username
      });

      return { user, token };
    } catch (error) {
      console.error('Error logging in:', error);
      return null;
    }
  }

  static async getAdminById(id: number): Promise<AdminUser | null> {
    try {
      const db = getDatabase();
      const user = db.prepare('SELECT * FROM admin_users WHERE id = ?').get(id) as AdminUser | undefined;
      return user || null;
    } catch (error) {
      console.error('Error getting admin by id:', error);
      return null;
    }
  }

  static async getAllAdmins(): Promise<AdminUser[]> {
    try {
      const db = getDatabase();
      const users = db.prepare('SELECT * FROM admin_users ORDER BY created_at DESC').all() as AdminUser[];
      return users;
    } catch (error) {
      console.error('Error getting all admins:', error);
      return [];
    }
  }

  static async deleteAdmin(id: number): Promise<boolean> {
    try {
      const db = getDatabase();
      const deleteStmt = db.prepare('DELETE FROM admin_users WHERE id = ?');
      deleteStmt.run(id);
      return true;
    } catch (error) {
      console.error('Error deleting admin:', error);
      return false;
    }
  }
}
