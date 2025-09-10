# Lesson Page Components

## MediaPlayer Component

Component chính để xử lý cả audio và video YouTube trong lesson page.

### Props
- `audioSrc: string` - URL của audio file
- `youtubeUrl?: string` - URL của YouTube video (optional)
- `timeStart: number` - Thời gian bắt đầu phát (giây)
- `timeEnd: number` - Thời gian kết thúc phát (giây)
- `onError?: (error: string) => void` - Callback khi có lỗi
- `className?: string` - CSS class

### Logic
- Nếu `audioSrc` là null/empty và có `youtubeUrl` → sử dụng YouTubePlayer
- Ngược lại → sử dụng AudioPlayer

## YouTubePlayer Component

Component để phát video YouTube với khả năng:
- **Hiển thị video YouTube thực tế** trên màn hình (không chỉ audio)
- Phát video từ `timeStart` đến `timeEnd` và **tự động tạm dừng** khi đến `timeEnd`
- **2 nút control**: 
  - Nút xanh dương: Seek đến `timeStart` (không phát)
  - Nút xanh lá: Phát trong khoảng thời gian và tự động tạm dừng
- Logic chính xác dựa trên a.js: sử dụng setTimeout thay vì setInterval
- Tự động seek đến `timeStart` khi chuyển challenge
- Clean, gọn gàng code - bỏ các phần thừa

### Props
- `youtubeUrl: string` - URL của YouTube video
- `timeStart: number` - Thời gian bắt đầu phát (giây)
- `timeEnd: number` - Thời gian kết thúc phát (giây)
- `onError?: (error: string) => void` - Callback khi có lỗi
- `className?: string` - CSS class

### Ref Methods
- `playVideo()` - Phát video
- `stopVideo()` - Dừng video
- `seekTo(time: number)` - Nhảy đến thời gian cụ thể

## AudioPlayer Component

Component để phát audio file với khả năng:
- Phát audio từ `timeStart` đến `timeEnd`
- Tự động dừng khi đến `timeEnd`

### Props
- `audioSrc: string` - URL của audio file
- `timeStart: number` - Thời gian bắt đầu phát (giây)
- `timeEnd: number` - Thời gian kết thúc phát (giây)
- `onError?: (error: string) => void` - Callback khi có lỗi
- `className?: string` - CSS class

## Cách sử dụng

```tsx
import { MediaPlayer } from './components/lessonPage';

// Trong LessonPage
<MediaPlayer
  audioSrc={currentChallenge.audio_src}
  youtubeUrl={lesson.youtube_url || undefined}
  timeStart={currentChallenge.time_start}
  timeEnd={currentChallenge.time_end}
  onError={setAudioError}
  className="mb-8"
/>
```

## API Response Format

```json
{
  "audioSrc": "",
  "challenges": [
    {
      "id": 6,
      "lesson_id": 5,
      "position": 1,
      "content": "Good day, I'm Mark from Self Sufficient Me. And I selected 10 vegetables",
      "default_input": "Good day, I'm Mark from Self Sufficient Me. ",
      "json_content": ["Good","day,",["I'm","I am"],"Mark","from","Self","Sufficient","Me.","And","I","selected",["10","ten"],"vegetables"],
      "solution": [["Good"],["day,"],["I'm","I am"],["Mark"],["from"],["Self"],["Sufficient"],["Me."],["And"],["I"],["selected"],["10","ten"],["vegetables"]],
      "audio_src": "null",
      "time_start": 0.13,
      "time_end": 4.87,
      "hint": "null",
      "hints": [],
      "explanation": "null",
      "always_show_explanation": true,
      "nb_comments": 0
    }
  ],
  "youtubeUrl": "https://www.youtube.com/watch?v=b3waibCUoKo"
}
```

### Logic xử lý:
- Nếu `audio_src` là "null" hoặc empty → sử dụng YouTube video
- Nếu có `audio_src` hợp lệ → sử dụng audio player
- Mỗi challenge sẽ phát từ `time_start` đến `time_end` và **tự động tạm dừng**
- **2 nút control rõ ràng**:
  - Nút xanh dương: Seek đến `time_start` (không phát)
  - Nút xanh lá: Phát trong khoảng thời gian và tự động tạm dừng
- Logic chính xác dựa trên a.js: sử dụng setTimeout với checkAndPauseAtEnd
- Video sẽ tạm dừng chính xác ở `time_end` của mỗi challenge
- Khi chuyển challenge, video tự động seek đến `time_start` mới
