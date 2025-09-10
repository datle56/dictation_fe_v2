/**
 * Tạo ra một tên ẩn danh ngẫu nhiên bằng cách kết hợp một con vật và một tính từ.
 * Danh sách đã được mở rộng để tạo ra nhiều kết quả đa dạng và thú vị hơn.
 */

// DANH SÁCH TÍNH TỪ MỞ RỘNG
const adjectives = [
  // Cảm xúc tích cực
  'Hạnh phúc', 'Vui vẻ', 'Hí hửng', 'Hân hoan', 'Phấn khởi', 'Tươi tắn',
  'Rạng rỡ', 'Yêu đời', 'Lạc quan', 'Sung sướng', 'Ngọt ngào', 'Ấm áp',
  'Bình yên', 'Thanh thản', 'Nhẹ nhõm', 'Sảng khoái', 'Hài lòng', 'Toại nguyện',
  'Tự hào', 'Tràn đầy năng lượng', 'Phấn chấn', 'Háo hức',

  // Trạng thái & Tính cách
  'Hồn nhiên', 'Nhí nhố', 'Dễ thương', 'Đáng yêu', 'Tinh nghịch', 'Nghịch ngợm',
  'Lém lỉnh', 'Tò mò', 'Hiếu kỳ', 'Thông thái', 'Minh mẫn', 'Sắc sảo',
  'Dũng cảm', 'Quả cảm', 'Kiên cường', 'Tốt bụng', 'Nhân hậu', 'Chân thành',
  'Khiêm tốn', 'Giản dị', 'Năng động', 'Hoạt bát', 'Sôi nổi', 'Trầm tính',
  'Ít nói', 'Bí ẩn', 'Lạnh lùng', 'Kiêu kỳ', 'Mộng mơ', 'Lãng đãng',

  // Miêu tả & Tưởng tượng
  'Lấp lánh', 'Óng ánh', 'Rực rỡ', 'Nhảy múa', 'Phiêu du', 'Du mục',
  'Ngái ngủ', 'Mơ màng', 'Đang bay', 'Lơ lửng', 'Vô hình', 'Bí mật',
  'Âm thầm', 'Thầm lặng', 'Tí hon', 'Khổng lồ', 'Thần tiên', 'Diệu kỳ',
  'Ma thuật', 'Huyền ảo', 'Cổ điển', 'Hoài niệm', 'Tinh khôi', 'Trong trẻo'
];

// DANH SÁCH CON VẬT MỞ RỘNG
const animals = [
  // Động vật có vú trên cạn
  'Cún', 'Mèo Ú', 'Gấu Trúc', 'Sóc Chuột', 'Thỏ Con', 'Cáo', 'Sói',
  'Hổ', 'Sư Tử', 'Báo', 'Voi', 'Tê Giác', 'Hươu Cao Cổ', 'Ngựa Vằn',
  'Lạc Đà', 'Koala', 'Kangaroo', 'Gấu Túi', 'Chồn Đất', 'Nhím', 'Lười',

  // Động vật biển
  'Cá Heo', 'Cá Voi', 'Cá Mập', 'Hải Cẩu', 'Sư Tử Biển', 'Rái Cá',
  'Bạch Tuộc', 'Mực', 'Sứa', 'Sao Biển', 'Cá Ngựa', 'Rùa Biển', 'Cá Hề',

  // Chim
  'Vẹt', 'Sáo', 'Đại Bàng', 'Cú Mèo', 'Chim Cánh Cụt', 'Hồng Hạc',
  'Thiên Nga', 'Công', 'Đà Điểu', 'Chim Ruồi',

  // Bò sát & Lưỡng cư
  'Tắc Kè Hoa', 'Kỳ Nhông', 'Cá Sấu', 'Ếch Cây',

  // Côn trùng & Khác
  'Bướm', 'Chuồn Chuồn', 'Bọ Rùa', 'Ong Mật',
  
  // Sinh vật thần thoại / Tưởng tượng
  'Rồng', 'Phượng Hoàng', 'Kỳ Lân'
];

export function createAnonymousName(): string {
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
  
  return `${randomAnimal} ${randomAdjective}`;
}

export function createGuestUser() {
  return {
    id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: createAnonymousName(),
    email: '',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
    level: 1,
    xp: 0,
    streak: 0,
    totalLessons: 0,
    totalWins: 0,
    isGuest: true
  };
}
