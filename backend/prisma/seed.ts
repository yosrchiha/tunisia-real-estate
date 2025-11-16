import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create Roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Administrator with full access',
    },
  });

  const homeownerRole = await prisma.role.upsert({
    where: { name: 'homeowner' },
    update: {},
    create: {
      name: 'homeowner',
      description: 'Can list and manage properties',
    },
  });

  const buyerRole = await prisma.role.upsert({
    where: { name: 'buyer' },
    update: {},
    create: {
      name: 'buyer',
      description: 'Can browse and buy properties',
    },
  });

  const renterRole = await prisma.role.upsert({
    where: { name: 'renter' },
    update: {},
    create: {
      name: 'renter',
      description: 'Can browse and rent properties',
    },
  });

  // Create Permissions
  const permissions = [
    { name: 'property.create', description: 'Create new properties' },
    { name: 'property.read', description: 'View properties' },
    { name: 'property.update', description: 'Update properties' },
    { name: 'property.delete', description: 'Delete properties' },
    { name: 'user.manage', description: 'Manage users' },
    { name: 'booking.create', description: 'Create bookings' },
    { name: 'booking.manage', description: 'Manage all bookings' },
    { name: 'review.create', description: 'Write reviews' },
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm,
    });
  }

  // Assign permissions to Admin role (gets everything)
  const allPermissions = await prisma.permission.findMany();
  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
  }

  // Assign permissions to Homeowner (property management)
  const homeownerPerms = await prisma.permission.findMany({
    where: {
      name: {
        in: ['property.create', 'property.read', 'property.update', 'property.delete'],
      },
    },
  });

  for (const permission of homeownerPerms) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: homeownerRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: homeownerRole.id,
        permissionId: permission.id,
      },
    });
  }

  // Assign permissions to Buyer/Renter (view and book)
  const buyerPerms = await prisma.permission.findMany({
    where: {
      name: {
        in: ['property.read', 'booking.create', 'review.create'],
      },
    },
  });

  for (const permission of buyerPerms) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: buyerRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: buyerRole.id,
        permissionId: permission.id,
      },
    });

    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: renterRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: renterRole.id,
        permissionId: permission.id,
      },
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log(`📋 Created ${permissions.length} permissions`);
  console.log('👥 Created 4 roles: admin, homeowner, buyer, renter');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });