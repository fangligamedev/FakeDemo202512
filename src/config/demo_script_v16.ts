export type AssetType = 'image' | 'video' | 'code' | 'markdown' | 'dashboard';

export interface DemoStep {
    id: string;
    title: string;
    description: string;
    zone: 'trend' | 'builder' | 'marketing';
    duration: number; // ms

    // The asset to display when this step is active/clicked
    asset?: {
        type: AssetType;
        url: string; // relative to /assets/demo_v16/
        previewUrl?: string; // for thumbnail (optional, usually same as url for img)
    };

    // UI Triggers
    uiAction?: 'CODE_VIEW_OPEN' | 'MARKETING_VIEW_OPEN' | 'AUTO_PREVIEW';
}

export const DEMO_SCRIPT: DemoStep[] = [
    // --- BUILDER PHASE ---
    {
        id: 'step_gdd',
        title: 'Generate Game Design',
        description: 'Creating GDD & Mechanics...',
        zone: 'builder',
        duration: 4000,
        asset: { type: 'markdown', url: '/assets/demo_v16/game_design_doc.md' },
        uiAction: 'AUTO_PREVIEW'
    },
    {
        id: 'step_story',
        title: 'Draft Story',
        description: 'Generating nonlinear narrative...',
        zone: 'builder',
        duration: 4000,
        asset: { type: 'markdown', url: '/assets/demo_v16/story_draft.md' },
        uiAction: 'AUTO_PREVIEW'
    },
    {
        id: 'step_char',
        title: 'Character',
        description: 'Generating pixel sprites...',
        zone: 'builder',
        duration: 3000,
        asset: { type: 'image', url: '/assets/demo_v16/char_hero.png' },
        uiAction: 'AUTO_PREVIEW'
    },
    {
        id: 'step_scene',
        title: 'Scene',
        description: 'Generating environment art...',
        zone: 'builder',
        duration: 3000,
        asset: { type: 'image', url: '/assets/demo_v16/scene_city.png' },
        uiAction: 'AUTO_PREVIEW'
    },
    {
        id: 'step_ui',
        title: 'UI Design',
        description: 'Layout and style generation...',
        zone: 'builder',
        duration: 12000,
        asset: { type: 'video', url: '/assets/demo_v16/doki_dialogue.mp4', previewUrl: '/assets/demo_v16/ui_hud.png' },
        uiAction: 'AUTO_PREVIEW'
    },
    {
        id: 'step_logic',
        title: 'Logic',
        description: 'Writing C# controllers...',
        zone: 'builder',
        duration: 5000,
        asset: { type: 'code', url: '/assets/demo_v16/player_controller.cs' },
        uiAction: 'AUTO_PREVIEW'
    },
    {
        id: 'step_integration',
        title: 'Integration',
        description: 'Asset pipeline linking.',
        zone: 'builder',
        duration: 1500
    },
    {
        id: 'step_optimization',
        title: 'Optimization',
        description: 'Compressing textures.',
        zone: 'builder',
        duration: 1500
    },
    {
        id: 'step_build',
        title: 'Build',
        description: 'Compiling WebGL binaries.',
        zone: 'builder',
        duration: 2000
    },
    {
        id: 'step_deploy',
        title: 'Deployment',
        description: 'Pushing to cloud edge.',
        zone: 'builder',
        duration: 1000
    },

    // --- VIDEO GEN ---
    {
        id: 'step_video',
        title: 'Game Video (VEO 3.1)',
        description: 'Generating gameplay trailer...',
        zone: 'marketing', // Or builder? Marketing makes sense for a trailer.
        duration: 12000,
        // Video generation step
        asset: { type: 'video', url: '/assets/demo_v16/pixel_game_demo.mp4', previewUrl: '/assets/demo_v16/gameplay_thumb.png' },
        uiAction: 'AUTO_PREVIEW'
    },

    // --- MARKING PHASE --- 
    {
        id: 'step_marketing_dashboard',
        title: 'Campaign Dashboard',
        description: 'Real-time analytics setup...',
        zone: 'marketing',
        duration: 8000,
        asset: { type: 'dashboard', url: '/assets/demo_v16/dashboard_data.json' },
        uiAction: 'AUTO_PREVIEW'
    },
    {
        id: 'step_marketing_web',
        title: 'Official Website',
        description: 'Generating landing page...',
        zone: 'marketing',
        duration: 4000,
        asset: { type: 'image', url: '/assets/demo_v16/website_landing.png' },
        uiAction: 'AUTO_PREVIEW'
    }
];
