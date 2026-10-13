export interface PublicHoliday {
    id: string;
    startDate: string;
    name: {language: string;text: string}[];
}//popisovanie vlastností odpovedí ktoré využívame z API, id je string, startDate je string, name je pole objektov s vlastnosťami language a text, obe sú stringy