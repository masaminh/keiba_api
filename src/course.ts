const courseId2courseName = new Map([
  ['101', '札幌'],
  ['102', '函館'],
  ['103', '福島'],
  ['104', '新潟'],
  ['105', '東京'],
  ['106', '中山'],
  ['107', '中京'],
  ['108', '京都'],
  ['109', '阪神'],
  ['110', '小倉'],
  ['236', '門別'],
  ['210', '盛岡'],
  ['211', '水沢'],
  ['218', '浦和'],
  ['219', '船橋'],
  ['220', '大井'],
  ['221', '川崎'],
  ['222', '金沢'],
  ['223', '笠松'],
  ['224', '名古屋'],
  ['227', '園田'],
  ['228', '姫路'],
  ['231', '高知'],
  ['232', '佐賀'],
]);

export default {
  Id2Name: (courseId: string): string => {
    const courseName = courseId2courseName.get(courseId);
    return courseName ?? '';
  },
};
