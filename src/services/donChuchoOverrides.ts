// Respuestas localizadas de Don Chucho para idiomas que no forman parte
// del conjunto base del NLU (árabe, japonés y coreano).
import type { Language } from '../types'
import type { SmallTalkIntent } from './donChuchoNlu'

type SmallTalkKey = Exclude<SmallTalkIntent, null>

export const SMALL_TALK_OVERRIDES: Partial<
  Record<Language, Partial<Record<SmallTalkKey, string>>>
> = {
  ar: {
    greeting: 'أهلاً يا صديقي! أنا دون تشوتشو، مرشدك في سالينتو. اسألني عن الطعام أو القهوة أو الإقامة أو الجولات أو الطقس أو التنقل. ماذا تحتاج؟',
    thanks: 'على الرحب والسعة يا صديقي! أنا هنا عندما تحتاجني.',
    goodbye: 'أتمنى لك رحلة رائعة في سالينتو! سأكون هنا عندما تحتاجني.',
    howAreYou: 'بخير، شكراً لسؤالك! مستعد لأريك سالينتو. ماذا تريد أن تعرف؟',
    identity: 'أنا دون تشوتشو، المرشد المحلي لـ Salento a la Mano. أعرف الطعام والقهوة والجولات والإقامة والنقل والنصائح العملية. كيف أساعدك؟',
    help: 'يمكنني مساعدتك في الطعام المحلي والقهوة والجولات والإقامة والنقل والطقس والتاريخ والحرف والدفع ونصائح السلامة. ماذا تحتاج؟',
    compliment: 'شكراً يا صديقي! يسعدني مساعدتك. هل نتابع بشيء آخر عن سالينتو؟',
    apology: 'لا تقلق. أنا هنا للمساعدة. ماذا تحتاج؟',
    affirm: 'ممتاز! أخبرني ماذا تريد أن تعرف أيضاً عن سالينتو.',
    deny: 'فهمت. إذا غيرت رأيك، سأكون هنا. ماذا تريد أن تعرف أيضاً؟'
  },
  ja: {
    greeting: 'こんにちは、友よ！サレントのガイド、ドン・チュッチョです。食事、コーヒー、宿泊、ツアー、天気、移動について聞いてください。何が必要ですか？',
    thanks: 'どういたしまして、友よ！必要なときはいつでもここにいます。',
    goodbye: 'サレントで素敵な旅を！必要なときはいつでもここにいます。',
    howAreYou: '元気です、聞いてくれてありがとう！サレントを案内する準備ができています。何を知りたいですか？',
    identity: '私は Salento a la Mano の地元ガイド、ドン・チュッチョです。食事、コーヒー、ツアー、宿泊、交通、実用的なヒントを知っています。どうお手伝いしましょうか？',
    help: '地元の食事、コーヒー、ツアー、宿泊、交通、天気、歴史、工芸品、支払い、安全のヒントをお手伝いできます。何が必要ですか？',
    compliment: 'ありがとう、友よ！お役に立ててうれしいです。サレントの別のことを続けましょうか？',
    apology: '大丈夫です。お手伝いするためにここにいます。何が必要ですか？',
    affirm: '完璧です！サレントについて他に知りたいことを教えてください。',
    deny: 'わかりました。気が変わったらここにいます。他に何を知りたいですか？'
  },
  ko: {
    greeting: '안녕하세요, 친구! 살렌토 가이드 돈 추초입니다. 음식, 커피, 숙소, 투어, 날씨, 이동에 대해 물어보세요. 무엇이 필요하신가요?',
    thanks: '천만에요, 친구! 필요할 때 언제든 여기 있습니다.',
    goodbye: '살렌토에서 멋진 여행 되세요! 필요할 때 언제든 여기 있습니다.',
    howAreYou: '잘 지내고 있습니다, 물어봐 주셔서 감사합니다! 살렌토를 보여드릴 준비가 되었습니다. 무엇을 알고 싶으신가요?',
    identity: '저는 Salento a la Mano의 현지 가이드 돈 추초입니다. 음식, 커피, 투어, 숙소, 교통, 실용적인 팁을 알고 있습니다. 어떻게 도와드릴까요?',
    help: '현지 음식, 커피, 투어, 숙소, 교통, 날씨, 역사, 공예품, 결제, 안전 팁을 도와드릴 수 있습니다. 무엇이 필요하신가요?',
    compliment: '감사합니다, 친구! 도움이 되어 기쁩니다. 살렌토에 대해 다른 것을 계속 알아볼까요?',
    apology: '괜찮습니다. 도와드리기 위해 여기 있습니다. 무엇이 필요하신가요?',
    affirm: '완벽합니다! 살렌토에 대해 더 알고 싶은 것을 알려주세요.',
    deny: '알겠습니다. 마음이 바뀌면 여기 있습니다. 또 무엇을 알고 싶으신가요?'
  },

  th: {
    greeting: 'สวัสดีครับเพื่อน! ผมคือดอนชูโช มัคคุเทศก์ของคุณในซาเลนโต ถามผมเรื่องอาหาร กาแฟ ที่พัก ทัวร์ อากาศ หรือการเดินทางได้เลย คุณต้องการอะไร?',
    thanks: 'ด้วยความยินดีครับเพื่อน! ผมอยู่ที่นี่เมื่อคุณต้องการ',
    goodbye: 'ขอให้เดินทางสนุกในซาเลนโต! ผมจะอยู่ที่นี่เมื่อคุณต้องการ',
    howAreYou: 'สบายดี ขอบคุณที่ถาม! พร้อมพาคุณเที่ยวซาเลนโต คุณอยากรู้เรื่องอะไร?',
    identity: 'ผมคือดอนชูโช มัคคุเทศก์ท้องถิ่นของ Salento a la Mano ผมรู้เรื่องอาหาร กาแฟ ทัวร์ ที่พัก การเดินทาง และเคล็ดลับที่เป็นประโยชน์ ให้ผมช่วยอย่างไร?',
    help: 'ผมช่วยเรื่องอาหารท้องถิ่น กาแฟ ทัวร์ ที่พัก การเดินทาง อากาศ ประวัติศาสตร์ งานฝีมือ การชำระเงิน และความปลอดภัยได้ คุณต้องการอะไร?',
    compliment: 'ขอบคุณครับเพื่อน! ดีใจที่ได้ช่วย มาต่อเรื่องอื่นของซาเลนโตกันไหม?',
    apology: 'ไม่เป็นไรครับ ผมอยู่ที่นี่เพื่อช่วย คุณต้องการอะไร?',
    affirm: 'เยี่ยม! บอกผมว่าคุณอยากรู้เรื่องอะไรเพิ่มเติมเกี่ยวกับซาเลนโต',
    deny: 'เข้าใจแล้ว ถ้าคุณเปลี่ยนใจ ผมอยู่ที่นี่ คุณอยากรู้เรื่องอะไรอีก?'
  },
  vi: {
    greeting: 'Xin chào bạn! Tôi là Don Chucho, hướng dẫn viên của bạn ở Salento. Hỏi tôi về đồ ăn, cà phê, chỗ ở, tour, thời tiết hoặc đi lại. Bạn cần gì?',
    thanks: 'Không có gì, bạn! Tôi ở đây khi bạn cần.',
    goodbye: 'Chúc bạn chuyến đi tuyệt vời ở Salento! Tôi sẽ ở đây khi bạn cần.',
    howAreYou: 'Tôi khỏe, cảm ơn bạn đã hỏi! Sẵn sàng chỉ bạn về Salento. Bạn muốn biết gì?',
    identity: 'Tôi là Don Chucho, hướng dẫn viên địa phương của Salento a la Mano. Tôi biết đồ ăn, cà phê, tour, chỗ ở, giao thông và mẹo thực tế. Tôi giúp gì được?',
    help: 'Tôi có thể giúp về đồ ăn địa phương, cà phê, tour, chỗ ở, giao thông, thời tiết, lịch sử, thủ công, thanh toán và an toàn. Bạn cần gì?',
    compliment: 'Cảm ơn bạn! Rất vui được giúp. Ta tiếp tục với điều khác về Salento nhé?',
    apology: 'Không sao. Tôi ở đây để giúp. Bạn cần gì?',
    affirm: 'Tuyệt! Cho tôi biết bạn còn muốn biết gì về Salento.',
    deny: 'Đã hiểu. Nếu đổi ý, tôi ở đây. Bạn muốn biết gì nữa?'
  },
  id: {
    greeting: 'Halo teman! Saya Don Chucho, pemandu Anda di Salento. Tanyakan makanan, kopi, penginapan, tur, cuaca, atau transportasi. Apa yang Anda butuhkan?',
    thanks: 'Sama-sama, teman! Saya di sini saat Anda butuh.',
    goodbye: 'Semoga perjalanan Anda menyenangkan di Salento! Saya di sini saat Anda butuh.',
    howAreYou: 'Baik, terima kasih sudah bertanya! Siap menunjukkan Salento. Apa yang ingin Anda ketahui?',
    identity: 'Saya Don Chucho, pemandu lokal Salento a la Mano. Saya tahu makanan, kopi, tur, penginapan, transportasi, dan tips praktis. Bagaimana saya bisa membantu?',
    help: 'Saya bisa membantu soal makanan lokal, kopi, tur, penginapan, transportasi, cuaca, sejarah, kerajinan, pembayaran, dan tips keselamatan. Apa yang Anda butuhkan?',
    compliment: 'Terima kasih, teman! Senang bisa membantu. Lanjut ke hal lain tentang Salento?',
    apology: 'Tidak masalah. Saya di sini untuk membantu. Apa yang Anda butuhkan?',
    affirm: 'Sempurna! Beri tahu saya apa lagi yang ingin Anda ketahui tentang Salento.',
    deny: 'Mengerti. Jika berubah pikiran, saya di sini. Apa lagi yang ingin Anda ketahui?'
  },
  ms: {
    greeting: 'Helo kawan! Saya Don Chucho, pemandu anda di Salento. Tanya saya tentang makanan, kopi, penginapan, lawatan, cuaca atau pengangkutan. Apa yang anda perlukan?',
    thanks: 'Sama-sama, kawan! Saya di sini bila anda perlukan.',
    goodbye: 'Semoga perjalanan anda menyeronokkan di Salento! Saya di sini bila anda perlukan.',
    howAreYou: 'Baik, terima kasih bertanya! Sedia menunjukkan Salento. Apa yang anda ingin tahu?',
    identity: 'Saya Don Chucho, pemandu tempatan Salento a la Mano. Saya tahu makanan, kopi, lawatan, penginapan, pengangkutan dan tip praktikal. Bagaimana saya boleh membantu?',
    help: 'Saya boleh membantu tentang makanan tempatan, kopi, lawatan, penginapan, pengangkutan, cuaca, sejarah, kraf, pembayaran dan tip keselamatan. Apa yang anda perlukan?',
    compliment: 'Terima kasih, kawan! Gembira dapat membantu. Teruskan dengan perkara lain tentang Salento?',
    apology: 'Tiada masalah. Saya di sini untuk membantu. Apa yang anda perlukan?',
    affirm: 'Sempurna! Beritahu saya apa lagi yang anda ingin tahu tentang Salento.',
    deny: 'Faham. Jika berubah fikiran, saya di sini. Apa lagi yang anda ingin tahu?'
  }

}

export const FALLBACK_OVERRIDES: Partial<Record<Language, string>> = {
  ar: 'لم أجد إجابة دقيقة لذلك يا صديقي. يمكنني مساعدتك في الطعام المحلي والقهوة والجولات والإقامة والنقل والطقس والحرف والدفع ونصائح السفر. هل يمكنك إعادة صياغة السؤال أو اختيار موضوع؟',
  ja: '正確な答えが見つかりませんでした、友よ。地元の食事、コーヒー、ツアー、宿泊、交通、天気、工芸品、支払い、旅のヒントをお手伝いできます。言い換えるか、テーマを選んでください。',
  ko: '정확한 답을 찾지 못했습니다, 친구. 현지 음식, 커피, 투어, 숙소, 교통, 날씨, 공예품, 결제, 여행 팁을 도와드릴 수 있습니다. 다시 말씀해 주시거나 주제를 선택해 주세요.',
  th: 'ผมไม่พบคำตอบที่แน่นอนครับเพื่อน ผมช่วยเรื่องอาหารท้องถิ่น กาแฟ ทัวร์ ที่พัก การเดินทาง อากาศ งานฝีมือ การชำระเงิน และเคล็ดลับการเดินทางได้ ลองพูดใหม่หรือเลือกหัวข้อไหม?',
  vi: 'Tôi không tìm thấy câu trả lời chính xác, bạn. Tôi có thể giúp về đồ ăn địa phương, cà phê, tour, chỗ ở, giao thông, thời tiết, thủ công, thanh toán và mẹo du lịch. Bạn có thể nói lại hoặc chọn chủ đề không?',
  id: 'Saya tidak menemukan jawaban yang tepat, teman. Saya bisa membantu soal makanan lokal, kopi, tur, penginapan, transportasi, cuaca, kerajinan, pembayaran, dan tips perjalanan. Bisakah Anda mengulangi atau memilih topik?',
  ms: 'Saya tidak menemui jawapan yang tepat, kawan. Saya boleh membantu tentang makanan tempatan, kopi, lawatan, penginapan, pengangkutan, cuaca, kraf, pembayaran dan tip perjalanan. Boleh ulang atau pilih topik?'
}

export const GENERAL_SUGGESTIONS_OVERRIDES: Partial<Record<Language, string[]>> = {
  ar: ['ماذا يمكنني أن أفعل؟', 'أين آكل؟', 'كيف أصل إلى هناك؟'],
  ja: ['何ができますか？', 'どこで食べられますか？', 'どうやって行きますか？'],
  ko: ['무엇을 할 수 있나요?', '어디서 먹을 수 있나요?', '어떻게 가나요?'],
  th: ['มีอะไรให้ทำบ้าง?', 'กินที่ไหน?', 'ไปอย่างไร?'],
  vi: ['Có gì để làm?', 'Ăn ở đâu?', 'Đi như thế nào?'],
  id: ['Apa yang bisa saya lakukan?', 'Di mana makan?', 'Bagaimana cara ke sana?'],
  ms: ['Apa yang boleh saya lakukan?', 'Di mana makan?', 'Bagaimana hendak ke sana?']
}

export const WEATHER_SUGGESTIONS_OVERRIDES: Partial<Record<Language, string[]>> = {
  ar: ['ما الملابس التي آخذها؟', 'أفضل وقت للوادي؟', 'هل توجد جولات في المطر؟'],
  ja: ['どんな服装を持っていく？', '谷に行くのに最適な時間は？', '雨の日でもツアーはありますか？'],
  ko: ['어떤 옷을 가져갈까요?', '계곡에 가기 좋은 시간은?', '비 올 때도 투어가 있나요?'],
  th: ['ควรเตรียมเสื้อผ้าแบบไหน?', 'เวลาไหนดีที่สุดสำหรับหุบเขา?', 'มีทัวร์ตอนฝนตกไหม?'],
  vi: ['Nên mang quần áo gì?', 'Thời điểm tốt nhất đến thung lũng?', 'Có tour khi trời mưa không?'],
  id: ['Pakaian apa yang harus dibawa?', 'Waktu terbaik ke lembah?', 'Ada tur saat hujan?'],
  ms: ['Pakaian apa yang perlu dibawa?', 'Masa terbaik ke lembah?', 'Ada lawatan ketika hujan?']
}
