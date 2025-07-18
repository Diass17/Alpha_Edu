<template>
  <div class="p-6">
    <!-- Заголовок + Поиск -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Список студентов</h1>
      <div class="relative bg-[#F1EFFF] w-1/4">
        <el-input
          v-model="searchQuery"
          placeholder="Поиск"
          clearable
          class="w-full bg-[#F1EFFF] borderrounded-xl"
          @clear="applyFilters"
          @keyup.enter="applyFilters"
        >
          <template #prefix>
            <Search class="text-purple-400" />
          </template>
        </el-input>
      </div>
    </div>

    <!-- Кнопки Добавить / Фильтр / Сохранить в Excel -->
    <div class="mt-4 flex items-center space-x-2 bg-[#F1EFFF] p-1 ">
      <el-button
        class="flex items-center text-purple-600 bg-white border border-purple-200 hover:bg-purple-100 "
        size="medium"
        @click="onAddStudent"
      >
        <img :src="addStudentLogo" alt="Добавить" class="w-5 h-5 mr-2" />
        Добавить студента
      </el-button>
      <el-button
        :class="[
          'flex items-center  text-purple-600 hover:bg-purple-100',
          showFilter
            ? 'bg-purple-500 border border-purple-500 text-white'
            : 'bg-white border border-purple-200'
        ]"
        size="medium"
        @click="showFilter = !showFilter"
      >
        <img :src="filterLogo" alt="Фильтр" class="w-5 h-5 mr-2" />
        Фильтр
      </el-button>
    
      <input
        type="file"
        ref="excelInput"
        accept=".xlsx,.xls"
        style="display: none"
        @change="handleExcelFile"
      />

      <el-button
        class="flex items-center text-purple-600 bg-white border border-purple-200 hover:bg-purple-100"
        size="medium"
        @click="triggerExcelInput"
      >
        <img :src="arrowUpLogo" alt="Импорт" class="w-5 h-5 mr-2" />
        Загрузить из файла
      </el-button>

      <el-button
        class="flex items-center text-purple-600 bg-white border border-purple-200 hover:bg-purple-100 "
        size="medium"
        @click="onSaveExcel"
        >
        <img :src="arrowDownLogo" alt="Экспорт" class="w-5 h-5 mr-2" />
        Скачать шаблон
      </el-button>
    </div>

    <!-- Панель фильтров -->
    <el-card
      v-if="showFilter"
      class="mt-4 bg-purple-50 border border-purple-200 rounded-xl"
      shadow="never"
    >
      <div class="flex flex-wrap gap-4 items-center">
        <div>
          <el-select
            v-model="filter.course"
            placeholder="Выбрать курс"
            clearable
            class="w-48"
          >
            <el-option
              v-for="c in courses"
              :key="c"
              :label="c"
              :value="c"
            />
          </el-select>
        </div>
        <div>
          <el-select
            v-model="filter.stream"
            placeholder="Выбрать поток"
            clearable
            class="w-48"
          >
            <el-option
              v-for="s in streams"
              :key="s"
              :label="s"
              :value="s"
            />
          </el-select>
        </div>
        <el-checkbox v-model="filter.topStudent">
          Top Student
        </el-checkbox>
        <el-button
          type="primary"
          @click="onResetFilters"
          size="small"
          class="rounded-xl"
        >
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
          <tr
            v-for="(s, idx) in filteredList"
            :key="s.id"
            class="cursor-pointer hover:bg-gray-50 even:bg-purple-50"
            @click="goToProfile(s.id)"
          >
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

// Поиск и фильтры
const searchQuery = ref('')
const showFilter  = ref(false)
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

// Загрузка данных
onMounted(async () => {
  await store.fetchStudents()
})

// Навигация
function onAddStudent() {
  router.push({ name: 'NewStudent' })
}
function goToProfile(id: number) {
  router.push({ name: 'StudentDetail', params: { id } })
}

const excelInput = ref<HTMLInputElement | null>(null);

function triggerExcelInput() {
  // Открыть окно выбора файла
  excelInput.value?.click();
}

async function handleExcelFile(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    const data = e.target?.result;
    const workbook = XLSX.read(data, { type: 'binary' });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // 📥 Преобразуем лист в массив объектов
    const json = XLSX.utils.sheet_to_json<any>(sheet);

    // ✅ Для отладки — можно вывести json в консоль
    console.log('Импортированные студенты:', json);

    // Отправка каждого студента на сервер
    for (const s of json) {
      try {
        // Преобразуй названия колонок Excel под нужный формат
        await store.createStudent({
          full_name: s['ФИО'] || '',
          iin: s['ИИН'] || '',
          email: s['Email'] || '',
          phone: s['Телефон'] || '',
          status: s['Статус'] || '',
          top_student: s['Топ'] === 'Да',
          funding_source: s['Финансирование'],
          subject: s['Курс'] || '',
          total_cost: Number(s['Общая_стоимость']) || 0,
          paid_amount: Number(s['Оплачено']) || 0,
          paymentPeriod: 0, // Можно задать по умолчанию или импортировать
          stream_id: undefined,
          discount_percent: 0,
          amount_remaining: 0
        });
      } catch (err) {
        console.error('Ошибка при добавлении из Excel:', err);
      }
    }

    alert('Импорт завершён');
  };

  reader.readAsBinaryString(file);
}

// Экспорт в Excel
function onSaveExcel() {
  store.exportToExcel()
}

// Фильтрация и поиск
function applyFilters() {}
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