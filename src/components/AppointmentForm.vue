<template>
  <div class="appointment-container">
    <div class="header">
      <h2 class="title">社区肠胃预约登记表</h2>
    </div>
    
    <div class="description">
      <p>尊敬的客户：</p>
      <p class="indentation-text">您好，为顺利为您安排胃肠镜检查，请您填写以下信息表。</p>
      <p class="indentation-text">预约须知：检查时间目前仅开放工作日，选择后请按指导进行肠道准备。</p>
      <p class="indentation-text">咨询方式：若有任何疑问，欢迎工作时间拨打81048194，或扫码咨询"市一消化内镜医管家"获取帮助。</p>
      
      <!-- 图片展示区域 -->
      <div class="image-section">
        <div 
          class="image-wrapper" 
     
        >
          <van-image
            width="120"
            height="120"
            fit="contain"
            :src="qrCodeImage"
            class="qr-code"
            @click="showImage"
          >
            <template v-slot:loading>
              <van-loading type="spinner" size="20" />
            </template>
          </van-image>
         <!-- <p class="image-tip">点击放大</p>-->
        </div>
      </div>
    </div>

    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <!-- 姓名 -->
        <van-field
          v-model="formData.name"
          name="name"
          label="您的姓名"
          placeholder="请输入姓名"
          required
          :rules="rules.name"
        />

        <!-- 性别 -->
        <van-field name="gender" label="您的性别" required :rules="rules.gender">
          <template #input>
            <van-radio-group v-model="formData.gender" direction="horizontal">
              <van-radio name="男">男</van-radio>
              <van-radio name="女">女</van-radio>
            </van-radio-group>
          </template>
        </van-field>

        <!-- 手机号 -->
        <van-field
          v-model="formData.phone"
          name="phone"
          label="手机号码"
          type="tel"
          placeholder="请输入手机号码"
          required
          :rules="rules.phone"
        />

        <!-- 预约日期 -->
        <van-field
          v-model="formData.date"
          is-link
          readonly
          name="date"
          label="预约日期"
          placeholder="点击选择预约日期"
          required
          @click="showCalendar = true"
          :rules="rules.date"
        />
        <van-calendar
          v-model:show="showCalendar"
          :min-date="minDate"
          :formatter="formatter"
          @confirm="onConfirmDate"
          color="#1989fa"
        />

        <!-- 时段选择 -->
        <van-field name="timeSlot" label="时段选择" required :rules="rules.timeSlot">
          <template #input>
            <van-radio-group v-model="formData.timeSlot" direction="horizontal">
              <van-radio
                v-for="option in timeSlotOptions"
                :key="option.value"
                :name="option.value"
                class="mr-4"
              >
                {{ option.text }}
              </van-radio>
            </van-radio-group>
          </template>
        </van-field>

        <!-- 检查项目 -->
        <van-field name="item" label="检查项目" required :rules="rules.item">
          <template #input>
            <van-radio-group v-model="formData.item" direction="vertical">
              <van-radio name="胃镜" class="mb-2">胃镜</van-radio>
              <van-radio name="肠镜" class="mb-2">肠镜</van-radio>
              <van-radio name="胃镜+肠镜">胃镜+肠镜</van-radio>
            </van-radio-group>
          </template>
        </van-field>
      </van-cell-group>

      <div class="btn-box">
        <van-button round block type="primary" native-type="submit" :loading="loading" loading-text="提交中...">
          提交预约
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showSuccessToast, showFailToast, showImagePreview } from 'vant';
import type { CalendarDayItem } from 'vant';
import wx from 'weixin-js-sdk';
import { phonePattern, formatDate } from '@/utils';
import { submitAppointment } from '@/api/appointment';
import type { AppointmentForm, TimeSlot, CheckItem } from '@/types';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';

const router = useRouter();

// 图片资源
// const qrCodeImage = 'https://img.yzcdn.cn/vant/cat.jpeg'; // 替换为实际的二维码图片URL
import qrCodeImage from '@/assets/img/qrcode.png'
// 微信SDK配置
const initWxSdk = () => {
  // 这里应该调用后端接口获取签名配置
  wx.config({
    debug: false,
    appId: 'wxd61c0dc744569288',
    timestamp: Date.now(),
    nonceStr: 'nonceStr',
    signature: 'signature',
    jsApiList: ['scanQRCode', 'previewImage']
  });

  wx.ready(() => {
    console.log('WeChat SDK Ready');
  });

  wx.error((res: any) => {
    console.error('WeChat SDK Error:', res);
  });
};

// onMounted(() => {
//   initWxSdk();
// });

// 图片预览与扫码
const isLongPress = ref(false);
let touchTimer: ReturnType<typeof setTimeout> | null = null;

const showImage = () => {
  showImagePreview({
    images: [qrCodeImage],
    closeable: true,
  });
};

const handleScan = () => {
  wx.scanQRCode({
    needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果
    scanType: ['qrCode', 'barCode'],
    success: (res: any) => {
      const result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
      showSuccessToast(`扫码成功: ${result}`);
    },
    fail: (err: any) => {
      // 在非微信环境或SDK未初始化成功时提供降级处理或提示
      console.error('Scan failed', err);
      showFailToast('扫码功能需在微信环境中使用');
    }
  });
};

// 长按判定逻辑
const handleTouchStart = () => {
  isLongPress.value = false;
  touchTimer = setTimeout(() => {
    isLongPress.value = true;
    handleScan(); // 800ms 后触发扫码
  }, 800);
};

const handleTouchEnd = () => {
  if (touchTimer) {
    clearTimeout(touchTimer);
    touchTimer = null;
  }
};

const handleTouchMove = () => {
  if (touchTimer) {
    clearTimeout(touchTimer);
    touchTimer = null;
  }
};

const handleImageClick = () => {
  if (!isLongPress.value) {
    showImage();
  }
};

// 表单验证规则集中管理
const rules = {
  name: [{ required: true, message: '请填写您的姓名' }],
  gender: [{ required: true, message: '请选择您的性别' }],
  phone: [
    { required: true, message: '请填写手机号码' },
    { pattern: phonePattern, message: '手机号码格式不正确' }
  ],
  date: [{ required: true, message: '请选择预约日期' }],
  timeSlot: [{ required: true, message: '请选择时段' }],
  item: [{ required: true, message: '请选择检查项目' }]
};

// 表单数据
const formData = reactive<AppointmentForm>({
  name: '',
  gender: '男', // 默认值
  phone: '',
  date: '',
  timeSlot: '上午' as TimeSlot, // 默认值
  item: '胃镜' as CheckItem
});

// 时段选项
const timeSlotOptions = [
  { text: '上午', value: '上午' },
  { text: '下午', value: '下午' }
];

// 日历控制
const showCalendar = ref(false);
const minDate = new Date(); // 今天开始
const formatter = (day: CalendarDayItem) => {
  const date = day.date!;
  const d = date.getDay();
  // 0 is 星期天, 6 is 星期六
  if (d === 0 || d === 6) {
    day.type = 'disabled';
  }
  return day;
};
const onConfirmDate = (value: Date) => {
  formData.date = formatDate(value);
  showCalendar.value = false;
};



// 提交逻辑
const loading = ref(false);
const { isSubmitSuccess } = useUnsavedChanges(formData);

onMounted(() => {
  // initWxSdk();
});

const onSubmit = async () => {
  loading.value = true;
  try {
    await submitAppointment(formData);
    isSubmitSuccess.value = true; // 标记提交成功，不再拦截
    showSuccessToast('预约提交成功！');
    // 跳转到成功页
    router.push('/success');
  } catch (error: any) {
    showFailToast(error.message || '提交失败');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.appointment-container {
  padding-bottom: 20px;
}
.header {
  padding: 20px 16px;
  background-color: #fff;
  text-align: center;
  margin-bottom: 12px;
}
.title {
  margin: 0;
  font-size: 20px;
  color: #1989fa;
}
.description {
  padding: 16px;
  background-color: #fff;
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}
.description p {
  margin: 8px 0;
}
.mb-2 {
  margin-bottom: 8px;
}
.indentation-text{
  text-indent: 2em;
}
.image-section {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}
.image-wrapper {
  text-align: center;
  cursor: pointer;
}
.image-tip {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}
.mr-4 {
  margin-right: 16px;
}
.btn-box {
  margin-top: 16px;
}
</style>
