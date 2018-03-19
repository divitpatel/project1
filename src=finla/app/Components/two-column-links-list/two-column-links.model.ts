export enum LinkIconType {
    Pdf = 0,
    Doc = 1
}
export interface ILinkListItemModel {
    title: string,
    icon: boolean,
    iconstyle: LinkIconType,
    description: string,
    value: any
}

