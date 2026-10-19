# PROMPT: WEBSITE CHÚC MỪNG 20/10 – MISTY REVEAL

Bạn là một Senior Frontend Developer kiêm UI/UX Designer. Hãy xây dựng một website chúc mừng Ngày Phụ nữ Việt Nam 20/10 với hiệu ứng tương tác độc đáo: **người dùng dùng chuột hoặc ngón tay để lau lớp sương mù trên màn hình, từ từ khám phá nội dung lời chúc ẩn phía sau.**

## 1. Ý tưởng chính

Khi người dùng truy cập website, toàn bộ màn hình xuất hiện một lớp sương mù trắng mờ, mềm mại, chuyển động nhẹ nhàng. Phía sau lớp sương là một khung cảnh lãng mạn, tinh tế cùng lời chúc mừng 20/10.

Người dùng có thể:
- Trên máy tính: giữ chuột trái và di chuyển để lau sương.
- Trên điện thoại hoặc máy tính bảng: dùng ngón tay chạm và vuốt để lau sương.
- Khi lau, lớp sương biến mất theo đường di chuyển của chuột/ngón tay, tạo cảm giác như đang dùng tay lau một tấm kính phủ hơi nước.
- Phần nội dung phía sau dần được hé lộ tự nhiên.
- Khi lau đủ diện tích, kích hoạt hiệu ứng chúc mừng đặc biệt.

## 2. Thiết kế giao diện

Phong cách: dreamy, romantic, elegant, soft glassmorphism, cinematic, hiện đại và giàu cảm xúc.

Bảng màu:
- Trắng kem, hồng phấn, pastel tím và xanh trời nhạt.
- Ánh sáng vàng ấm nhẹ.
- Không sử dụng nền đen chủ đạo hoặc neon quá gắt.
- Hạn chế gradient nặng nề và các chi tiết trang trí rối mắt.

Khung cảnh phía sau lớp sương:
- Một khu vườn hoa nhẹ nhàng với hoa hồng, hoa tulip hoặc hoa cúc.
- Ánh nắng dịu, những hạt sáng li ti và cánh hoa bay chậm.
- Có thể sử dụng hình ảnh nền chất lượng cao hoặc tự thiết kế bằng CSS.
- Bố cục responsive, đẹp trên cả màn hình desktop và điện thoại.

## 3. Hiệu ứng sương mù tương tác

Đây là tính năng quan trọng nhất, cần được triển khai thực sự, không chỉ tạo hiệu ứng hình thức.

Sử dụng HTML Canvas để tạo lớp sương phủ toàn màn hình.

Yêu cầu kỹ thuật:
- Canvas phủ kín viewport và tự điều chỉnh theo kích thước màn hình.
- Ban đầu lớp sương có độ che phủ cao, khoảng 90–95%.
- Sử dụng Canvas compositing, chẳng hạn `globalCompositeOperation = 'destination-out'`, để xóa lớp sương theo đường di chuyển của con trỏ.
- Tạo vùng lau có mép mềm, mờ tự nhiên, không phải hình tròn sắc cạnh.
- Khi người dùng giữ chuột hoặc chạm màn hình và di chuyển, tạo đường lau liên tục, mượt mà.
- Xử lý đúng `pointerdown`, `pointermove`, `pointerup`, `pointercancel` để hỗ trợ chuột, cảm ứng và bút cảm ứng.
- Dùng `requestAnimationFrame` khi cần để tối ưu hiệu năng.
- Không cuộn trang ngoài ý muốn trong lúc người dùng lau trên màn hình cảm ứng.
- Canvas phải được xử lý đúng khi đổi kích thước cửa sổ, xoay điện thoại hoặc thay đổi mật độ điểm ảnh.
- Không tạo các khoảng trống ngẫu nhiên trên lớp sương khi mới tải trang.

Lớp sương nên có thêm chuyển động chậm, độ trong suốt thay đổi nhẹ và một chút hiệu ứng blur để tạo cảm giác chân thực.

Có thể tạo một lớp sương nền bằng CSS blur kết hợp với Canvas mask để đạt chất lượng thị giác tốt hơn.

## 4. Màn hình mở đầu

Khi truy cập website, hiển thị nội dung nhỏ ở giữa màn hình:

“Có một điều xinh đẹp đang chờ cậu khám phá…”

Bên dưới:

“Dùng tay lau nhẹ lớp sương để mở món quà nhé ♡”

Có biểu tượng bàn tay hoặc hiệu ứng gợi ý vị trí chạm nhẹ nhàng.

Khi người dùng bắt đầu lau lần đầu:
- Dòng hướng dẫn dần mờ đi.
- Hiệu ứng lau sương trở thành tâm điểm.
- Không xuất hiện popup gây gián đoạn.
- Không tự động xóa sương hoàn toàn khi chưa có tương tác.

## 5. Nội dung ẩn phía sau

Ở giữa màn hình, thiết kế một tấm thiệp chúc mừng đẹp mắt với nội dung:

“Chúc mừng ngày Phụ nữ Việt Nam 20/10”

Tiêu đề nổi bật, kiểu chữ thanh lịch, kết hợp font serif mềm mại và sans-serif hiện đại.

Lời chúc:

“Có một điều mà văn chương dạy chúng ta, rằng vẻ đẹp của con người chưa bao giờ chỉ nằm ở những gì mắt thường có thể nhìn thấy. Đó còn là lòng tử tế trong cách đối đãi, sự kiên cường khi đối diện với nghịch cảnh và khả năng giữ lại những điều tốt đẹp trong một thế giới không phải lúc nào cũng dịu dàng.

Nhân ngày Phụ nữ Việt Nam 20/10, chúc cậu luôn được yêu thương, được trân trọng và luôn tìm thấy những niềm vui bình dị trong cuộc sống. Mong rằng mỗi ngày trôi qua đều có những điều dịu dàng đến với cậu, và cậu luôn có đủ bình yên để mỉm cười theo cách của riêng mình.

Chúc cậu có một ngày 20/10 thật nhiều niềm vui và thật đáng nhớ!”

Phần lời chúc phải dễ đọc, căn chỉnh đẹp, không quá nhỏ trên điện thoại.

Cho phép chỉnh sửa tên người nhận, lời chúc và chữ ký ở một khu vực cấu hình riêng trong code.

Cuối thiệp có dòng:

“Made with love ♡”

## 6. Hiệu ứng khi khám phá hoàn tất

Theo dõi tỷ lệ diện tích lớp sương đã được lau.

Khi người dùng đã khám phá khoảng 70–80% diện tích:
- Lớp sương tự tan dần phần còn lại.
- Những cánh hoa xuất hiện và bay nhẹ.
- Các hạt sáng lung linh xuất hiện tinh tế.
- Tấm thiệp có hiệu ứng fade-in và chuyển động nổi nhẹ.
- Hiển thị dòng chữ: “Một món quà nhỏ dành riêng cho cậu ♡”

Hiệu ứng cần mượt, không quá sến, không làm giảm khả năng đọc nội dung.

Có thể thêm nút “Lau lại từ đầu” để người dùng trải nghiệm lại.

## 7. Âm thanh

Có thể tích hợp nhạc nền piano nhẹ nhàng hoặc âm thanh không khí thiên nhiên.

- Không tự động phát âm thanh khi trang vừa tải.
- Có nút bật/tắt nhạc rõ ràng.
- Nếu có nhạc, sử dụng file âm thanh do người phát triển cung cấp hoặc một nguồn được phép sử dụng.
- Website vẫn phải hoàn chỉnh nếu không có file âm thanh.

## 8. Công nghệ

Ưu tiên:
- React hoặc Next.js.
- TypeScript.
- Tailwind CSS.
- HTML Canvas API cho hiệu ứng lau sương.
- CSS animations hoặc Framer Motion cho hiệu ứng giao diện nếu cần.

Nếu dự án hiện tại đã có framework thì hãy sử dụng framework đó, không tự ý tạo lại dự án từ đầu.

Không cần backend hoặc cơ sở dữ liệu. Website có thể deploy tĩnh lên Vercel hoặc hosting hỗ trợ phù hợp.

## 9. Tối ưu trải nghiệm

- Responsive hoàn chỉnh cho desktop, tablet và mobile.
- Hỗ trợ màn hình cảm ứng bằng thao tác vuốt ngón tay thực sự.
- Không dùng ảnh giả lập thao tác lau; hiệu ứng phải hoạt động trực tiếp.
- Tối ưu Canvas để tránh giật lag trên điện thoại cấu hình trung bình.
- Không để lớp sương che mất các nút điều khiển cần thiết.
- Tôn trọng `prefers-reduced-motion` để hạn chế chuyển động nếu người dùng yêu cầu.
- Có nội dung dự phòng nếu Canvas không được hỗ trợ.
- Đảm bảo độ tương phản và khả năng đọc của lời chúc.

## 10. Yêu cầu đầu ra

Hãy triển khai website hoàn chỉnh, không chỉ viết bản demo hoặc mô tả ý tưởng.

Trước tiên, hãy xác định cấu trúc dự án. Sau đó viết đầy đủ các component, CSS, logic Canvas và cách khởi chạy.

Nếu dự án chưa tồn tại, hãy khởi tạo cấu trúc phù hợp.

Code phải sạch, có thể chạy được, dễ chỉnh sửa và không để lại các nút bấm giả hoặc TODO cho tính năng cốt lõi.

Ưu tiên cao nhất là trải nghiệm: **người dùng thực sự cảm thấy mình đang dùng chuột hoặc ngón tay lau một lớp sương mù trên tấm kính để khám phá một tấm thiệp 20/10 được giấu phía sau.**