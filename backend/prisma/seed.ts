import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create permissions
  const permissionsData = [
    { action: 'manage', subject: 'all', description: 'Full access to all resources' },
    { action: 'read', subject: 'Template', description: 'Read template collection' },
    { action: 'write', subject: 'Template', description: 'Create, update, delete templates' },
    { action: 'read', subject: 'Blog', description: 'Read blog posts' },
    { action: 'write', subject: 'Blog', description: 'Create, update, delete blog posts' },
    { action: 'read', subject: 'Lead', description: 'View leads in CRM' },
    { action: 'write', subject: 'Lead', description: 'Update CRM lead status and notes' },
    { action: 'manage', subject: 'Setting', description: 'Modify global site configuration' },
  ];

  const permissions: any = {};
  for (const perm of permissionsData) {
    const record = await prisma.permission.upsert({
      where: { action_subject: { action: perm.action, subject: perm.subject } },
      update: { description: perm.description },
      create: perm,
    });
    permissions[`${perm.action}_${perm.subject}`] = record;
  }

  // 2. Create roles
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'Super Admin' },
    update: {},
    create: {
      name: 'Super Admin',
      description: 'Super administrator with full permissions',
      permissions: {
        connect: [{ id: permissions['manage_all'].id }],
      },
    },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: {
      name: 'Admin',
      description: 'Administrator with template, blog, and lead privileges',
      permissions: {
        connect: [
          { id: permissions['read_Template'].id },
          { id: permissions['write_Template'].id },
          { id: permissions['read_Blog'].id },
          { id: permissions['write_Blog'].id },
          { id: permissions['read_Lead'].id },
          { id: permissions['write_Lead'].id },
        ],
      },
    },
  });

  const staffRole = await prisma.role.upsert({
    where: { name: 'Staff' },
    update: {},
    create: {
      name: 'Staff',
      description: 'Staff member who can manage templates and view leads',
      permissions: {
        connect: [
          { id: permissions['read_Template'].id },
          { id: permissions['write_Template'].id },
          { id: permissions['read_Lead'].id },
          { id: permissions['write_Lead'].id },
        ],
      },
    },
  });

  const editorRole = await prisma.role.upsert({
    where: { name: 'Editor' },
    update: {},
    create: {
      name: 'Editor',
      description: 'Editor who can write templates and blogs',
      permissions: {
        connect: [
          { id: permissions['read_Template'].id },
          { id: permissions['write_Template'].id },
          { id: permissions['read_Blog'].id },
          { id: permissions['write_Blog'].id },
        ],
      },
    },
  });

  // 3. Create default Super Admin user
  const adminPasswordHash = await bcrypt.hash('adminpassword', 10);
  await prisma.user.upsert({
    where: { email: 'admin@richcards.in' },
    update: { passwordHash: adminPasswordHash },
    create: {
      email: 'admin@richcards.in',
      name: 'RichCards Admin',
      passwordHash: adminPasswordHash,
      roleId: superAdminRole.id,
    },
  });

  // 4. Create default Categories
  const categoriesData = [
    { name: 'Wedding Invitations', slug: 'wedding-invitations', displayOrder: 1 },
    { name: 'Save The Date', slug: 'save-the-date', displayOrder: 2 },
    { name: 'Monograms', slug: 'monograms', displayOrder: 3 },
    { name: 'Wardrobe Planners', slug: 'wardrobe-planners', displayOrder: 4 },
  ];

  const categories: any = {};
  for (const cat of categoriesData) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, displayOrder: cat.displayOrder },
      create: cat,
    });
    categories[cat.slug] = record;
  }

  // 5. Create default Tags
  const tagsData = [
    { name: 'Traditional', slug: 'traditional' },
    { name: 'Minimalist', slug: 'minimalist' },
    { name: 'Floral', slug: 'floral' },
    { name: 'Royal', slug: 'royal' },
    { name: 'Animated Video', slug: 'animated-video' },
  ];

  const tags: any = {};
  for (const t of tagsData) {
    const record = await prisma.tag.upsert({
      where: { slug: t.slug },
      update: { name: t.name },
      create: t,
    });
    tags[t.slug] = record;
  }

  // 6. Seed Global Settings
  const settingsData = [
    { key: 'site_name', value: 'RichCards India', description: 'Public site name' },
    { key: 'brand_color_primary', value: '#0B0B0B', description: 'Brand primary color (Deep Black)' },
    { key: 'brand_color_secondary', value: '#D4AF37', description: 'Brand secondary color (Champagne Gold)' },
    { key: 'brand_color_accent', value: '#FDFBF7', description: 'Brand accent color (Ivory White)' },
    { key: 'whatsapp_number', value: '+919016705775', description: 'Direct WhatsApp contact number' },
    { key: 'contact_email', value: 'hello@richcards.in', description: 'Public support email' },
    { key: 'instagram_handle', value: 'richcardsindia', description: 'Instagram handle' },
    { key: 'seo_default_title', value: 'RichCards India | Luxury Digital Wedding Invitations & Monograms', description: 'Default SEO Site Title' },
    { key: 'seo_default_description', value: 'RichCards design studio specializes in premium digital wedding invitation videos, save the dates, e-cards, custom monograms, and wedding stationery.', description: 'Default SEO Site Meta Description' },
  ];

  for (const setting of settingsData) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value, description: setting.description },
      create: setting,
    });
  }

  // 7. Seed sample template
  const sampleTemplate = await prisma.template.upsert({
    where: { slug: 'royal-gold-video-invitation' },
    update: {},
    create: {
      title: 'Royal Gold Video Invitation',
      slug: 'royal-gold-video-invitation',
      description: 'Exquisite gold themed video invitation for premium luxury wedding celebrations.',
      price: 2499.00,
      previewVideoUrl: 'BEDMUTHA & BORA.mp4',
      imageUrls: ['royal_gold_thumb.jpg'],
      watermarked: true,
      categoryId: categories['wedding-invitations'].id,
      tags: {
        connect: [{ id: tags['royal'].id }, { id: tags['animated-video'].id }],
      },
      displayOrder: 1,
    },
  });

  // 8. Seed Default SEO Metadata for Template
  await prisma.seoMetadata.upsert({
    where: { templateId: sampleTemplate.id },
    update: {},
    create: {
      title: 'Royal Gold Luxury Video Wedding Invitation | RichCards',
      description: 'Explore the royal gold digital wedding video invitation template. Personalize with your details and share via WhatsApp.',
      keywords: ['royal wedding invitation', 'video invitation', 'luxury card', 'digital invite'],
      templateId: sampleTemplate.id,
    },
  });

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
