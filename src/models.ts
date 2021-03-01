export interface Race {
  /**
   * example:
   * 2019122210611
   */
  id: string;
  /**
   * example:
   * 106
   */
  courseid: string;
  /**
   * example:
   * 中山
   */
  coursename: string;
  /**
   * example:
   * 11
   */
  racenumber: number; // int32
  /**
   * example:
   * 有馬記念
   */
  racename: string;
}
