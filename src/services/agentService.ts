import { AgentDemoResponse, AgentStep } from '../types';

export class AgentService {
  static generatePlan(prompt: string, _builderRole: string = 'fullstack'): AgentStep[] {
    const cleanPrompt = prompt.trim();
    const lowerPrompt = cleanPrompt.toLowerCase();

    if (
      lowerPrompt.includes('storefront') ||
      lowerPrompt.includes('shop') ||
      lowerPrompt.includes('cart') ||
      lowerPrompt.includes('product') ||
      lowerPrompt.includes('gallery')
    ) {
      return [
        {
          step_number: 1,
          title: 'Plan ready',
          description: 'Mapped the page structure and component boundaries',
          status: 'done',
          time_label: '2m',
          details: 'Parsed design tokens and product layout hierarchy.',
        },
        {
          step_number: 2,
          title: 'Building gallery',
          description: 'Updating 3 components with smooth transitions',
          status: 'active',
          time_label: 'now',
          details: 'Modifying ProductGallery.vue, ImageCarousel.tsx, and theme.css.',
        },
        {
          step_number: 3,
          title: 'Reviewing checks',
          description: 'Browser previews and layout responsiveness validated',
          status: 'pending',
          time_label: 'pending',
          details: 'Automated headless viewport tests across mobile and desktop.',
        },
      ];
    } else if (
      lowerPrompt.includes('auth') ||
      lowerPrompt.includes('login') ||
      lowerPrompt.includes('jwt') ||
      lowerPrompt.includes('user') ||
      lowerPrompt.includes('signup')
    ) {
      return [
        {
          step_number: 1,
          title: 'Security schema planned',
          description: 'Defined JWT claims, password hashing, and role policies',
          status: 'done',
          time_label: '1m',
          details: 'Generated user model with bcrypt and refresh tokens.',
        },
        {
          step_number: 2,
          title: 'Implementing endpoints',
          description: 'Writing auth router and session middleware',
          status: 'active',
          time_label: 'now',
          details: 'Created /auth/login, /auth/register, and /auth/me.',
        },
        {
          step_number: 3,
          title: 'Verification suite',
          description: 'Running unit tests for token expiration and edge cases',
          status: 'pending',
          time_label: 'pending',
          details: 'Checked unauthorized handling, password strength, and token reuse.',
        },
      ];
    } else {
      return [
        {
          step_number: 1,
          title: 'Plan mapped',
          description: `Analyzed requirements for '${cleanPrompt.slice(0, 45)}...'`,
          status: 'done',
          time_label: '1m',
          details: 'Synthesized implementation path and identified target modules.',
        },
        {
          step_number: 2,
          title: 'Executing implementation',
          description: 'Applying edits and synchronizing architecture',
          status: 'active',
          time_label: 'now',
          details: 'Running code transforms across frontend and backend modules.',
        },
        {
          step_number: 3,
          title: 'Running checks',
          description: 'Verifying tests, linting, and live preview rendering',
          status: 'pending',
          time_label: 'pending',
          details: 'Performing health checks and contract verification.',
        },
      ];
    }
  }

  static simulateDemo(prompt: string, builderRole: string = 'fullstack'): AgentDemoResponse {
    const steps = this.generatePlan(prompt, builderRole);
    const lowerPrompt = prompt.toLowerCase();

    let files: string[];
    let diff: string;
    let proj: string;

    if (
      lowerPrompt.includes('storefront') ||
      lowerPrompt.includes('shop') ||
      lowerPrompt.includes('product') ||
      lowerPrompt.includes('gallery')
    ) {
      files = ['src/components/ProductGallery.tsx', 'src/components/ImageCarousel.tsx', 'src/styles/theme.css'];
      diff = '+142 lines, -38 lines across 3 files';
      proj = 'atlas / storefront-refresh';
    } else if (
      lowerPrompt.includes('dark') ||
      lowerPrompt.includes('theme') ||
      lowerPrompt.includes('color') ||
      lowerPrompt.includes('mode')
    ) {
      files = ['src/theme/tokens.css', 'src/components/ThemeToggle.tsx'];
      diff = '+68 lines, -14 lines across 2 files';
      proj = 'orbit / theme-engine';
    } else {
      files = ['src/core/workspace.ts', 'src/components/View.tsx', 'tests/view.spec.ts'];
      diff = '+94 lines, -20 lines across 3 files';
      const cleanSlug = prompt.slice(0, 18).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
      proj = `orbit / ${cleanSlug || 'workspace'}`;
    }

    return {
      prompt,
      project_name: proj,
      branch: 'main',
      steps,
      files_affected: files,
      diff_summary: diff,
      status: 'ready',
    };
  }
}
