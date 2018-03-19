/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

// to enable importing .json files in ts
declare module "*.json" {
  const value: any;
  export default value;
}