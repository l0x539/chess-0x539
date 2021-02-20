// Bresenham's line algorithm
pub fn draw_ray(mut sq1:u8, mut sq2: u8) -> Vec<u8> {
    let _sq1 = if sq1>sq2 {sq2} else {sq1};
    sq2 = if sq2>sq1 {sq2} else {sq1};
    sq1 = _sq1;
    let mut vec: Vec<u8> = Vec::new();
    let mut x0 = (sq1%8) as f32;
    let mut y0 = (sq1/8) as f32;
    let mut x1 = (sq2%8) as f32;
    let mut y1 = (sq2/8) as f32;

    let m: f32;

    let ( a, b, d1, d2, mut d, mut x, mut y);

    if x1 < x0 {
        d = x0;
        x0 = x1;
        x1 = d;
        d = y0;
        y0 = y1;
        y1 = d;
    }

    a = y0 - y1;
    b = x1 - x0;

    if b == 0. { m = -1.0 * a as f32 * 100.0 } else { m = a as f32 / (x0 - x1) as f32 }

    x = x0;
    y = y0;

    vec.push((y as u8)*8+(x as u8));

    if m >= 0.0 && m <= 1.0 {
        d = 2. * a + b;
        d1 = 2. * a;
        d2 = 2. * (a + b);
        while x < x1 {
            if d <= 0. {
                x += 1.;
                y += 1.;
                d += d2
            } else {
                x += 1.;
                d += d1
            }
            vec.push((y as u8)*8+(x as u8));
        }
    } else if m <= 0.0 && m <= -1.0 {
        d = 2. * a - b;
        d1 = 2. * a - 2. * b;
        d2 = 2. * a;
        while x < x1 {
            if d > 0. {
                x += 1.;
                y -= 1.;
                d += d1
            } else {
                x += 1.;
                d += d2;
            }
            vec.push((y as u8)*8+(x as u8));
        }
    } else if m > 1.0 {
        d = a + 2. * b;
        d1 = 2. * (a + b);
        d2 = 2. * b;
        while y < y1 {
            if d > 0. {
                x += 1.;
                y += 1.;
                d += d1
            } else {
                y += 1.;
                d += d2;
            }
            vec.push((y as u8)*8+(x as u8));
        }
    } else {
        d = a - 2. * b;
        d1 = -2. * b;
        d2 = 2. * (a - b);
        while y > y1 {
            if d <= 0. {
                x += 1.;
                y -= 1.;
                d += d2;
            } else {
                y -= 1.;
                d += d1;
            }
        }
        vec.push((y as u8)*8+(x as u8));
    }
    vec
}