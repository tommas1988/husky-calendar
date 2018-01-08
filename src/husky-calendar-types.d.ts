declare module "husky-calendar-types" {
    export interface SizeProp {
        width: number;
        height: number;
    }

    export interface GradeEntryProp {
        range: [number, number];
        bgColor: String;
        fontColor: String;
    }

    export interface DataSourceProp {
        date: Date;
        entries: number[];
    }
}