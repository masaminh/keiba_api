import Course from './course';

describe('Course', () => {
  test.each`
    courseId | expected
    ${'101'} | ${'札幌'}
    ${'999'} | ${''}
  `('Id2Nameは$courseIdに対して$expectedを返す', ({ courseId, expected }) => {
    const courseName = Course.Id2Name(courseId);
    expect(courseName).toEqual(expected);
  });
});
