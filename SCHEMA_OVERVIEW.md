# Sanity Schema Overview

## Schema Structure

### Singleton Documents (One instance each)

#### 1. `siteSettings`
Global site configuration:
- `name` - Your name
- `email` - Contact email
- `birthDate` - For dynamic age counter
- `githubUrl`, `linkedinUrl` - Social links
- `profileImage` - Homepage profile
- `cvProfileImage` - CV page profile
- `logoImage` - Site logo

#### 2. `frontpage`
Homepage content with field-level translations (_en/_no):
- **Hero Section**: title, description (supports {{age}} placeholder), workplace info
- **Portfolio Section**: section title, featured projects (references), small projects (references)
- **Bottom Section**: contact text, attribution, copy notification

#### 3. `cv`
CV page content with field-level translations:
- **Header**: page title, back button text
- **Section Titles**: projects, education, work, skills
- **Content References**: featured projects, education entries, work experiences, skill categories
- **Bottom Section**: contact text

---

### Content Documents (Multiple instances)

#### 4. `project`
Unified schema for both featured and small projects:
- `title_en/no`, `subtitle_en/no`, `description_en/no`
- `projectType` - "featured" or "small"
- `period_en/no` - Timeline display
- `image` + `imageAlt_en/no`
- `demoUrl`, `githubUrl`, `externalUrl` - Links
- `reportDocument` - PDF file upload
- `buttonText_en/no` - Custom CTA
- `technologies` - References to skills
- `order` - Display ordering

#### 5. `education`
Education entries:
- `institution_en/no`, `degree_en/no`, `location_en/no`
- `description_en/no`, `period_en/no`
- `startDate`, `endDate` (for sorting/filtering)
- `relatedProjects` - Project references
- `externalUrl`, `order`

#### 6. `workExperience`
Work history:
- `company_en/no`, `position_en/no`
- `description_en/no`, `period_en/no`
- `startDate`, `endDate`
- `companyUrl`
- `certificate` - PDF upload for reference letters
- `certificateLabel_en/no`
- `order`

#### 7. `skill`
Individual skills (reusable across projects/categories):
- `name` - Skill name (e.g., "React")
- `slug` - URL-friendly identifier
- `url` - Optional external link
- `icon` - Optional skill icon

#### 8. `skillCategory`
Groups of skills:
- `name_en/no` - Category name (e.g., "Development")
- `slug`
- `skills` - Array of skill references
- `order`

---

## Studio Structure

```
Content
├── Settings
│   └── Site Settings
├── Pages
│   ├── Frontpage
│   └── CV Page
├── Projects
├── Education
├── Work Experience
├── Skill Categories
└── Skills
```

---

## Key Features

1. **Field-level i18n**: All content fields have `_en` and `_no` variants
2. **References**: Projects, skills, education are reusable across pages
3. **File uploads**: PDFs for certificates and reports stored in Sanity
4. **Ordering**: `order` field on all content types for manual sorting
5. **Grouped fields**: Sanity studio groups related fields for better UX
6. **Singleton handling**: frontpage, cv, siteSettings can only have one document each
