// ============================================================================
// CẤU HÌNH NỘI DUNG VÀ THIẾT LẬP THIỆP 20/10
// Dễ dàng thay đổi tên người nhận, lời chúc, chữ ký và các thiết lập tại đây
// ============================================================================

export interface CardConfig {
  // Thông tin người nhận & tiêu đề
  recipient: string;
  badge?: string;
  title: string;
  subtitle: string;

  // Lời chúc chi tiết (mỗi phần tử là 1 đoạn văn)
  greetingParagraphs: string[];

  // Chữ ký & lời kết
  signature: string;
  madeWithLove: string;

  // Thiết lập hiệu ứng sương mù
  mistSettings: {
    revealThreshold: number; // Tỷ lệ diện tích lau để kích hoạt mở hoàn toàn (0.7 = 70%)
    brushSize: number;       // Kích thước nét cọ lau (pixel)
    mistDensity: number;     // Độ phủ sương ban đầu (0.92 = 92%)
    fadeSpeed: number;       // Tốc độ sương tan tự động khi đạt threshold (ms)
  };

  // Món quà nhỏ khi mở xong
  revealedMessage: string;
}

export const defaultCardConfig: CardConfig = {
  recipient: "Happy women's day",
  title: "Chúc Mừng Ngày Phụ Nữ Việt Nam 20/10",
  subtitle: "Yêu thương – Trân trọng – Dịu dàng",

greetingParagraphs: [
  "Có lẽ điều đẹp đẽ nhất ở một người không chỉ nằm ở những gì ta có thể nhìn thấy, mà còn ở sự tử tế trong cách đối đãi, sự dịu dàng dành cho mọi người và cách họ vẫn giữ được những điều tốt đẹp trong lòng giữa một thế giới đôi khi chẳng mấy dịu dàngg.",
  "Nhân ngày Phụ nữ Việt Nam 20/10, chúc Chii luôn được yêu thươngg, được trân trọng và gặp thật nhiều điều tử tế trong cuộc sống. Mong rằng những ngày bình thường nhất cũng sẽ có đôi điều khiến Chi vui vẻ, những lúc mệt mỏi luôn có sự bình yên để nghỉ ngơi, và dù cuộc sống có bận rộn đến đâu, Chi vẫn luôn tìm thấy những niềm vui nhỏ bé của riêng mình.",
  "Daaa tui chúc Chii có một ngày 20/10 thật vui vẻ, ấm áp và đáng nhớ nhé!"
],

  signature: "Thân ái & Yêu thương,",
  madeWithLove: "Made with love ♡",

  mistSettings: {
    revealThreshold: 0.70, // 70% lau xong là tự tan
    brushSize: 55,         // Bán kính cọ lau mượt mà
    mistDensity: 0.94,     // 94% mờ ban đầu
    fadeSpeed: 1200,       // 1.2s tan mịn màng
  },

  revealedMessage: "Một món quà nhỏ ♡",
};
