import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { UserPayload } from '../types/index';

const prisma = new PrismaClient();

// Get JWT secret from environment
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me';
const JWT_EXPIRES_IN = '7d';

/**
 * Register a new user
 */
export async function registerUser(
  username: string,
  email: string,
  password: string,
  roleName: string = 'buyer'
) {
  try {
    console.log('🔧 Starting user registration...');

    // 1. Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    // 2. Hash the password
    const passwordHash = await bcrypt.hash(password, 12);
    console.log('🔧 Password hashed');

    // 3. Find the role
    const role = await prisma.role.findUnique({
      where: { name: roleName },
    });

    if (!role) {
      throw new Error(`Role '${roleName}' not found. Available roles: buyer, homeowner, renter, admin`);
    }

    console.log('🔧 Using role:', role.name);

    // 4. Create the user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash, // Your schema uses 'passwordHash' not 'password'
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      }
    });

    // 5. Assign role to user through UserRole junction table
    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: role.id,
      },
    });

    console.log('✅ User created and role assigned successfully');

    // 6. Return user info
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      role: roleName
    };
  } catch (error) {
    console.error('❌ Registration error:', error);
    throw error;
  }
}

/**
 * Login user and return JWT token
 */
export async function loginUser(email: string, password: string) {
  try {
    console.log('🔧 Starting user login...');

    // 1. Find user with their roles through UserRole junction
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // 2. Check if user exists
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // 3. Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // 4. Get user's role names
    const roleNames = user.roles.map((ur) => ur.role.name);

    // 5. Create JWT payload
    const payload = {
      userId: user.id,
      email: user.email,
      username: user.username,
      roles: roleNames,
    };

    // 6. Sign the JWT token
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // 7. Return token and user info
    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: roleNames,
      },
    };
  } catch (error) {
    console.error('❌ Login error:', error);
    throw error;
  }
}

/**
 * Verify JWT token and return user data
 */
export const verifyToken = async (token: string): Promise<UserPayload> => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Your schema uses UUID strings, NOT numbers
    // Remove the parseInt conversion - keep it as string
    return {
      userId: decoded.userId, // Keep as string (UUID)
      email: decoded.email,
      username: decoded.username,
      role: decoded.roles?.[0] // Take first role
    };
  } catch (error) {
    console.error('❌ Token verification failed:', error);
    throw new Error('Invalid token');
  }
};

/**
 * Get user by ID with roles
 */
export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Remove password hash before returning
  const { passwordHash, ...userWithoutPassword } = user;

  return {
    ...userWithoutPassword,
    roles: user.roles.map((ur) => ur.role.name),
  };
}