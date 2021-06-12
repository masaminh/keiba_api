import Course from './course';

describe('Course', () => {
  test('Id2Name_101', () => {
    const courseName = Course.Id2Name('101');
    expect(courseName).toEqual('札幌');
  });
});

describe('Course', () => {
  test('Id2Name_999', () => {
    const courseName = Course.Id2Name('999');
    expect(courseName).toEqual('');
  });
});
