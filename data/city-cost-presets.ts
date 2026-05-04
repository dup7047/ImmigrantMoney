export type CityCostPreset = {
  city: string;
  rentBaseline: number;
  foodPerPerson: number;
  transport: number;
  healthcareUninsured: number;
  brokerFeeMultiplier: number;
};

export const cityCostPresets: CityCostPreset[] = [
  {city: "NYC", rentBaseline: 2400, foodPerPerson: 420, transport: 132, healthcareUninsured: 350, brokerFeeMultiplier: 1},
  {city: "LA", rentBaseline: 2200, foodPerPerson: 390, transport: 140, healthcareUninsured: 330, brokerFeeMultiplier: 0},
  {city: "Chicago", rentBaseline: 1600, foodPerPerson: 350, transport: 105, healthcareUninsured: 300, brokerFeeMultiplier: 0},
  {city: "Houston", rentBaseline: 1500, foodPerPerson: 330, transport: 220, healthcareUninsured: 290, brokerFeeMultiplier: 0},
  {city: "Miami", rentBaseline: 2100, foodPerPerson: 380, transport: 180, healthcareUninsured: 330, brokerFeeMultiplier: 0},
  {city: "Atlanta", rentBaseline: 1700, foodPerPerson: 340, transport: 210, healthcareUninsured: 300, brokerFeeMultiplier: 0},
  {city: "Dallas", rentBaseline: 1650, foodPerPerson: 340, transport: 220, healthcareUninsured: 300, brokerFeeMultiplier: 0},
  {city: "Boston", rentBaseline: 2500, foodPerPerson: 410, transport: 110, healthcareUninsured: 350, brokerFeeMultiplier: 0.5},
  {city: "Phoenix", rentBaseline: 1550, foodPerPerson: 330, transport: 210, healthcareUninsured: 300, brokerFeeMultiplier: 0},
  {city: "Other", rentBaseline: 1400, foodPerPerson: 325, transport: 180, healthcareUninsured: 290, brokerFeeMultiplier: 0}
];
