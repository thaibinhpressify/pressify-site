<script setup>
import HeaderSection from '~/components/sections/HeaderSection.vue'
import FaqItem from '~/components/questions/FaqItem.vue'
import QuestionsCta from '~/components/questions/QuestionsCta.vue'

useSeoMeta({
  title: 'Help Center',
  description: 'Frequently asked questions and support resources.',
  ogTitle: 'Help Center',
  ogDescription: 'Frequently asked questions and support resources.',
})

const faqs = [
  {
    title: 'What file formats do you accept for printing?',
    desc: 'We accept PDF, AI, EPS, and high-resolution JPEG/PNG files. PDF is preferred. Files should be CMYK color mode, 300 DPI, with 3mm bleed on all sides.'
  },
  {
    title: 'What payment methods do you accept?',
    desc: 'We accept Visa, Mastercard, PayPal, bank transfer, and net-30 terms for verified business accounts. All payments are secured by SSL encryption.'
  },
  {
    title: 'What is your standard turnaround time?',
    desc: 'We process orders within 1–3 business days. Most standard orders are produced within 1–3 business days. Shipping time is additional.'
  },
  {
    title: 'Can I cancel or modify my order?',
    desc: 'Yes. You can cancel or modify your order within 24 hours of placement. Please note that we may not be able to process your request if the order has been processed.'
  },
  {
    title: 'Can I order a sample before bulk printing?',
    desc: 'Yes. You can order a sample before bulk printing. Please contact us to schedule a sample print.'
  },
  {
    title: 'Do you offer design services?',
    desc: 'Yes. We offer design services for print orders. Please contact us for more information.'
  },
  {
    title: 'How do I track my order?',
    desc: 'You can track your order by logging into your account on our website. Once you have logged in, you can view the status of your order and any updates or changes to it.'
  },
  {
    title: 'What is your return policy?',
    desc: 'We accept returns within 30 days of purchase. Please contact us to initiate a return process.'
  }
]
</script>
<template>
  <div class="page questions">
    <HeaderSection
      status="Help Center"
      title="Frequently Asked Questions"
      desc="Find answers to common questions about our products and services."
    />

    <div class="container mx-auto py-[60px]">
      <div class="grid gap-x-[48px] gap-y-[16px] grid-cols-2">
        <FaqItem
          v-for="(item, index) in faqs"
          :key="item.title"
          :title="item.title"
          :desc="item.desc"
          :default-open="index === 0"
        />
      </div>
    </div>

    <QuestionsCta />
  </div>
</template>
