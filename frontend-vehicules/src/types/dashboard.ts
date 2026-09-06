export interface StatusCount {
  status: string;
  count: number;
}

export interface FuelCount {
  fuel_type: string;
  count: number;
}

export interface CategoryDistribution {
  name: string;
  vehicles_count: number;
}

export interface TechnicalStats {
  average: number;
  highest: number;
  total_fleet_distance: number;
}

export interface PricingOverview {
  min_daily: number;
  max_daily: number;
  avg_daily: number;
}

export interface DashboardStats {
  total_vehicles: number;
  status_distribution: StatusCount[];
  category_distribution: CategoryDistribution[];
  fuel_distribution: FuelCount[];
  technical_stats: TechnicalStats;
  pricing_overview: PricingOverview;
}
