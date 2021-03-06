use wasm_bindgen::JsCast;
use web_sys::*;
use wasm_bindgen::JsValue;
use wasm_bindgen::Clamped;
use super::chess_core::piece::*;

pub struct Component {
    url: String,
    pub piece: (Clamped<Vec<u8>>, u32, u32)
}

impl Component {
    pub fn new() -> Self {
        Self {
            url: String::from("/test.jpg"),
            piece: (Clamped::<Vec<u8>>(Vec::new()), 0, 0)
        }
    }

    pub fn init_piece(&mut self) {
        self.piece = self._get_piece_data().unwrap();
    }

    fn _get_piece_data(&self) -> Result<(Clamped<Vec<u8>>, u32, u32), JsValue> {
        let window = window().unwrap();
        let document = window.document().unwrap();

        let canvas = document.get_element_by_id("initCanvas").unwrap();
        let canvas: web_sys::HtmlCanvasElement = canvas.dyn_into::<web_sys::HtmlCanvasElement>()?;
        let ctx: CanvasRenderingContext2d = canvas.get_context("2d")?.unwrap().dyn_into()?;

        let image_obj = document.create_element("img")
            .unwrap()
            .dyn_into::<web_sys::HtmlImageElement>()
            .unwrap();

        image_obj.set_src(self.url.as_str());
        

        let image_x = 0;
        let image_y = 0;
        let image_width = image_obj.width();
        let image_height = image_obj.height();

        ctx.draw_image_with_html_canvas_element(&canvas, image_x as f64, image_y as f64)?;

        let  image_data = ctx.get_image_data(image_x as f64, image_y as f64, image_width as f64, image_height as f64);
        let data = image_data.unwrap().data();
        ctx.clear_rect(0., 0., canvas.width() as f64, canvas.height() as f64);
        Ok((data, image_width, image_height))
    }

    /* fn reolve_piece(&self, piece: u8, theme_id: u32) -> Vec<f64> {

        match piece {
            Piece::WPAWN => {
                
            },
            Piece::WKNIGHT => {

            },
            Piece::WBISHOP => {

            },
            Piece::WROOK => {

            },
            Piece::WQUEEN => {

            },
            Piece::WKING => {

            },
            Piece::BPAWN => {

            },
            Piece::BKNIGHT => {

            },
            Piece::BBISHOP => {

            },
            Piece::BQUEEN => {

            },
            Piece::BROOK => {

            },
        }
    } */
}