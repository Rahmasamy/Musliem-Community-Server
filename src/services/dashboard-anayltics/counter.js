let homeVisits = 0;

export const getHomeVisits = () => homeVisits;
export const incrementHomeVisits = () => {
  homeVisits++;
  return homeVisits;
};
