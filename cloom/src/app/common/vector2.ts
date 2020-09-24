export class Vector2
{
    x: number;
    y: number;

    constructor(x :number = 0, y: number = 0)
    {
        this.x = x;
        this.y = y;
    }

    equals(v: Vector2): boolean
    {
        if (v == null) return false;
        return this.x == v.x && this.y == v.y;
    }

    static compare(v1?: Vector2, v2?: Vector2) {
      if (v1 == null && v2 == null) return true;
      else if (v1 == null || v2 == null) return false;
      else {
        return v1.x == v2.x && v1.y == v2.y;
      }
    }

    copyFrom(original: Vector2)
    {
        if (original != null && original.x != null) this.x = original.x;
        if (original != null && original.y != null) this.y = original.y;
    }

    clone(): Vector2
    {
      let returnValue = new Vector2();

      returnValue.copyFrom(this);

      return returnValue;
    }

    get length(): number {
      return Math.sqrt(this.lengthSquared);
    }

    get lengthSquared(): number {
      return this.x * this.x + this.y * this.y;
    }

    static clone(original: Vector2 | undefined): Vector2 | null
    {
      if (original == null) return null;

      let returnValue = new Vector2();
      returnValue.copyFrom(original);
      return returnValue;
    }

    static distance(v1: Vector2, v2: Vector2): number {
      return Math.sqrt(Vector2.distanceSquared(v1, v2));
    } 

    static distanceSquared(v1: Vector2, v2: Vector2): number {
      return (v1.x - v2.x) * (v1.x - v2.x) + (v1.y - v2.y) * (v1.y - v2.y);
    }

    static average(v1: Vector2, v2: Vector2): Vector2 {
      return new Vector2((v1.x + v2.x) / 2, (v1.y + v2.y) / 2);
    }

    static add(v1: Vector2, v2: Vector2): Vector2 {
      return new Vector2(v1.x + v2.x, v1.y + v2.y);
    }

    static multiply(v1: Vector2, v2: Vector2): Vector2 {
      return new Vector2(v1.x * v2.x, v1.y * v2.y);
    }

    static divide(v1: Vector2, v2: Vector2): Vector2 {
      return new Vector2(v1.x / v2.x, v1.y / v2.y);
    }

    static scale(v1: Vector2, scale: number): Vector2 {
      return new Vector2(v1.x * scale, v1.y * scale);
    }

    static cloneNullToZero(original: Vector2 | undefined): Vector2
    {
      if (original == null || original == undefined) return Vector2.zero();

      let returnValue = new Vector2();
      returnValue.copyFrom(original);
      return returnValue;
    }

    public static zero() { return new Vector2(0, 0); }
    public static one() { return new Vector2(1, 1); }

    public static Zero = new Vector2();
    public static One = new Vector2(1, 1);
    public static Left = new Vector2(-1, 0);
    public static Right = new Vector2(1, 0);
    public static Up = new Vector2(0, 1);
    public static Down = new Vector2(0, -1);
}