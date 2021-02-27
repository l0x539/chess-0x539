
pub struct Drawer;
use wasm_bindgen::Clamped;

impl Drawer {
    pub fn fit_image_in_square(image_vec: Clamped<Vec<u8>>, image_width: u32, image_height: u32, square_height: u32, square_width: u32) -> Vec<f32>{
        let mut drawing_vec = Vec::new();
        for row in 0..(square_height as u32) {
            for p in 0..(square_width as u32) {
                let sqr = (((image_width * p)/square_width) + row*square_width) * 4;
                if sqr < (image_width * image_height * 4) {
                    drawing_vec.push((image_vec[(sqr) as usize] as f32) / 255.);
                    drawing_vec.push((image_vec[(sqr + 1) as usize] as f32) / 255.);
                    drawing_vec.push((image_vec[(sqr + 2) as usize] as f32) / 255.);
                    drawing_vec.push((image_vec[(sqr + 3) as usize] as f32) / 255.);
                }
            }
        }
        drawing_vec
    }

}