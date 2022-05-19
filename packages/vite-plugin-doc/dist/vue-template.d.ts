export interface MainVueType {
    html: string;
    imports: string[];
    components: string[];
    data: Record<string, any>;
}
export declare function getMainVue({ html, imports, components, data }: MainVueType): string;
export interface DemoVueType {
    id: string;
    virtualPath: string;
    title: string;
    description: string;
    code: string;
}
export declare function getDemoVue({ id, virtualPath, title, description, code, }: DemoVueType): string;
