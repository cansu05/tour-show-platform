export const TOUR_REGIONS = [
  {key: "kemer", label: "Kemer"},
  {key: "antalyaBelek", label: "Antalya / Belek"},
  {key: "sideManavgat", label: "Side / Manavgat"},
  {key: "alanya", label: "Alanya"}
] as const;

export const TOUR_DAYS = [
  {key: "monday", label: "Pazartesi"},
  {key: "tuesday", label: "Salı"},
  {key: "wednesday", label: "Çarşamba"},
  {key: "thursday", label: "Perşembe"},
  {key: "friday", label: "Cuma"},
  {key: "saturday", label: "Cumartesi"},
  {key: "sunday", label: "Pazar"}
] as const;

const TOUR_DAY_ORDER_INDEX = new Map(TOUR_DAYS.map((day, index) => [day.key, index]));

export function sortTourDays(days: string[]) {
  return [...days].sort((left, right) => {
    const leftIndex = TOUR_DAY_ORDER_INDEX.get(left as (typeof TOUR_DAYS)[number]['key']) ?? Number.MAX_SAFE_INTEGER;
    const rightIndex = TOUR_DAY_ORDER_INDEX.get(right as (typeof TOUR_DAYS)[number]['key']) ?? Number.MAX_SAFE_INTEGER;

    return leftIndex - rightIndex;
  });
}
