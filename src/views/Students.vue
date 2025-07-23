<template>
  <div class="p-6">
    <!-- Заголовок + Поиск -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Список студентов</h1>
      <div class="relative bg-[#F1EFFF] w-1/4">
        <el-input v-model="searchQuery" placeholder="Поиск" clearable class="w-full bg-[#F1EFFF] borderrounded-xl"
          @clear="applyFilters" @keyup.enter="applyFilters">
          <template #prefix>
            <Search class="text-purple-400" />
          </template>
        </el-input>
      </div>
    </div>

    <!-- Кнопки Добавить / Фильтр / Сохранить в Excel -->
    <div class="mt-4 flex items-center space-x-2 bg-[#F1EFFF] p-1 ">
      <el-button class="flex items-center text-purple-600 bg-white border border-purple-200 hover:bg-purple-100 "
        size="medium" @click="onAddStudent">
        <img :src="addStudentLogo" alt="Добавить" class="w-5 h-5 mr-2" />
        Добавить студента
      </el-button>
      <el-button :class="[
        'flex items-center  text-purple-600 hover:bg-purple-100',
        showFilter
          ? 'bg-purple-500 border border-purple-500 text-white'
          : 'bg-white border border-purple-200'
      ]" size="medium" @click="showFilter = !showFilter">
        <img :src="filterLogo" alt="Фильтр" class="w-5 h-5 mr-2" />
        Фильтр
      </el-button>

      <input type="file" ref="excelInput" accept=".xlsx,.xls" style="display: none" @change="handleExcelFile" />

      <el-button class="flex items-center text-purple-600 bg-white border border-purple-200 hover:bg-purple-100"
        size="medium" @click="triggerExcelInput">
        <img :src="arrowUpLogo" alt="Импорт" class="w-5 h-5 mr-2" />
        Загрузить из файла
      </el-button>

      <el-button class="flex items-center text-purple-600 bg-white border border-purple-200 hover:bg-purple-100 "
        size="medium" @click="onSaveExcel">
        <img :src="arrowDownLogo" alt="Экспорт" class="w-5 h-5 mr-2" />
        Скачать шаблон
      </el-button>
    </div>

    <!-- Панель фильтров -->
    <el-card v-if="showFilter" class="mt-4 bg-purple-50 border border-purple-200 rounded-xl" shadow="never">
      <div class="flex flex-wrap gap-4 items-center">
        <div>
          <el-select v-model="filter.course" placeholder="Выбрать курс" clearable class="w-48">
            <el-option v-for="c in courses" :key="c" :label="c" :value="c" />
          </el-select>
        </div>
        <div>
          <el-select v-model="filter.stream" placeholder="Выбрать поток" clearable class="w-48">
            <el-option v-for="s in streams" :key="s" :label="s" :value="s" />
          </el-select>
        </div>
        <el-checkbox v-model="filter.topStudent">
          Top Student
        </el-checkbox>
        <el-button type="primary" @click="onResetFilters" size="small" class="rounded-xl">
          Сбросить
        </el-button>
      </div>
    </el-card>

    <!-- Таблица студентов -->
    <div class="mt-6 overflow-auto bg-white border border-purple-200 rounded-xl">
      <table class="min-w-full bg-white">
        <thead class="bg-purple-50">
          <tr>
            <th class="px-6 py-6 text-purple-700 text-left"></th>
            <th class="px-6 py-6 text-purple-700 text-left">Студент</th>
            <th class="px-6 py-6 text-purple-700 text-left">ИИН</th>
            <th class="px-6 py-6 text-purple-700 text-left">Email</th>
            <th class="px-6 py-6 text-purple-700 text-left">Номер телефона</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(s, idx) in filteredList" :key="s.id" class="cursor-pointer hover:bg-gray-50 even:bg-purple-50"
            @click="goToProfile(s.id)">
            <td class="px-6 py-6">
              <span class="inline-flex items-center justify-center w-6 h-6 bg-purple-100 text-purple-600 rounded-md">
                {{ idx + 1 }}
              </span>
            </td>
            <td class="px-6 py-6 text-md text-gray-900">{{ s.full_name }}</td>
            <td class="px-6 py-6 text-md text-gray-900">{{ s.iin }}</td>
            <td class="px-6 py-6 text-md text-gray-900">{{ s.email }}</td>
            <td class="px-6 py-6 text-md text-gray-900">{{ s.phone }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStudentStore, Student } from '@/store/studentStore'
import { Search, Document } from '@element-plus/icons-vue'
import addStudentLogo from '@/assets/logos/addstudent.png'
import filterLogo from '@/assets/logos/filter.png'
import arrowDownLogo from '@/assets/logos/arrow-down.png'
import arrowUpLogo from '@/assets/logos/arrow-up.png'
import * as XLSX from 'xlsx'

const router = useRouter()
const store = useStudentStore()

const searchQuery = ref('')
const showFilter = ref(false)
const filter = ref({
  course: '' as string,
  stream: '' as string,
  topStudent: false,
})

// Опции фильтров
const courses = [
  'Data Science', 'Generative AI', 'IT право',
  'Введение в программирование', 'Вэб-разработка',
  'Графический и UI/UX дизайн', 'Машинное обучение и ИИ',
  'Мобильная разработка', 'Разработка игр',
  'Сети и информационная безопасность',
]
const streams = ['A1', 'B2', 'C3', 'D4']

onMounted(async () => {
  await store.fetchStudents()
})

function onAddStudent() {
  router.push({ name: 'NewStudent' })
}
function goToProfile(id: number) {
  router.push({ name: 'StudentDetail', params: { id } })
}

const excelInput = ref<HTMLInputElement | null>(null);

function triggerExcelInput() {
  excelInput.value?.click();
}

async function handleExcelFile(event: Event) {
  const fileInput = event.target as HTMLInputElement;
  const file = fileInput.files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = async (e) => {
    function normalizePhone(phone: any) {
      if (!phone) return '';
      let digits = String(phone).replace(/[^\d]/g, '');

      // Если начинается на 8 и длина 11 — заменим 8 на 7 (для Казахстана)
      if (digits.length === 11 && digits.startsWith('8')) {
        digits = '7' + digits.slice(1);
      }

      // Если длина 10 (без кода страны), добавим 7
      if (digits.length === 10) {
        digits = '7' + digits;
      }

      // После всех замен номер должен быть ровно 11 цифр
      if (digits.length !== 11) {
        throw new Error('Номер телефона должен состоять из 11 цифр (с кодом страны)');
      }

      return '+' + digits;
    }



    try {
      const data = e.target?.result;
      if (!data) throw new Error('Не удалось прочитать файл');

      const workbook = XLSX.read(data, { type: 'binary' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const students = XLSX.utils.sheet_to_json<any>(sheet);

      let successCount = 0;
      let failCount = 0;
      let errorMessages: string[] = [];

      for (const s of students) {
        try {
          const fullName = s['ФИО'] || '';
          const iin = (s['ИИН'] || '').toString().trim();
          const email = (s['Email'] || '').toString().trim();
          const status = (s['Статус'] || '').toString().trim();
          const topRaw = (s['Топ'] || '').toString().trim().toLowerCase();
          const rawFunding = (s['Финансирование'] || '').toString().trim().toLowerCase();

          // 🔒 Валидации
          if (!/^\d{12}$/.test(iin)) {
            throw new Error('ИИН должен состоять ровно из 12 цифр');
          }

          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new Error('Некорректный Email');
          }

          if (status !== 'Студент' && status !== 'Выпускник') {
            throw new Error('Статус должен быть "Студент" или "Выпускник"');
          }

          if (topRaw !== 'да' && topRaw !== 'нет') {
            throw new Error('Поле "Топ" должно быть "Да" или "Нет"');
          }

          let funding_source: string;
          if (rawFunding.includes('30')) {
            funding_source = 'discount_30';
          } else if (rawFunding.includes('70')) {
            funding_source = 'discount_70';
          } else if (rawFunding.includes('techorda')) {
            funding_source = 'techorda';
          } else if (rawFunding.includes('грант')) {
            funding_source = 'internal_grant';
          } else if (rawFunding.includes('полная')) {
            funding_source = 'full';
          } else {
            throw new Error(`Неверный формат финансирования: "${s['Финансирование']}"`);
          }

          await store.createStudent({
            full_name: fullName,
            iin,
            email,
            phone: normalizePhone(s['Телефон'] || ''),
            status,
            top_student: topRaw === 'да',
            funding_source,
            subject: s['Курс'] || '',
            total_cost: Number(s['Общая_стоимость']) || 0,
            paid_amount: Number(s['Оплачено']) || 0,
            discount_percent: Number(s['Скидка']) || 0,
            amount_remaining: 0,
            paymentPeriod: Number(s['Период_оплаты']) || 0,
            stream_id: undefined,
          });

          successCount++;
        } catch (err: any) {
          failCount++;
          const message = err?.response?.data?.message || err?.message || 'Неизвестная ошибка';
          const name = s['ФИО'] || 'Без имени';
          errorMessages.push(`• ${name}: ${message}`);
        }
      }

      let resultMessage = `✅ Импорт завершён:\n🟢 Успешно: ${successCount}\n🔴 Ошибки: ${failCount}`;
      if (errorMessages.length > 0) {
        resultMessage += `\n\n❌ Подробности:\n${errorMessages.join('\n')}`;
      }

      alert(resultMessage);
    } catch (err) {
      console.error('Ошибка при чтении Excel-файла:', err);
      alert('❌ Ошибка при обработке Excel-файла');
    }
  };

  reader.readAsBinaryString(file);
}



// Экспорт в Excel
function onSaveExcel() {
  store.exportToExcel()
}

// Фильтрация и поиск
function applyFilters() { }
function onResetFilters() {
  filter.value = { course: '', stream: '', topStudent: false }
  searchQuery.value = ''
}

// Итоговый список
const filteredList = computed<Student[]>(() =>
  store.list.filter((s) => {
    const bySearch =
      !searchQuery.value ||
      s.full_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.iin.includes(searchQuery.value)
    const byCourse = !filter.value.course || s.subject === filter.value.course
    const byStream = !filter.value.stream || s.stream === filter.value.stream
    const byTop = !filter.value.topStudent || s.top_student
    return bySearch && byCourse && byStream && byTop
  })
)



</script>

<style scoped>
/* Дополнительные сти */
</style>