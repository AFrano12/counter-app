export function localDateIso(date = new Date()):string {//localdateIso - nastaví dátum zariadenia
    const year = date.getFullYear();
    // Mesiace začínaju 0 a padStart doplní čísla na dve miesta (5->05)
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function daysUntil(target: string, today: string): number {

    const milisecondsPerDay = 24*60*60*1000; //Hodiny * minuty * sekundy * milisekundy
    const targetTime = Date.parse(target);// YYYY-MM-DD sa prevedie na UTC polnoc -> výpočet neovplivní zmena 
    const todayTime = Date.parse(today);

    return (targetTime - todayTime) / milisecondsPerDay

}