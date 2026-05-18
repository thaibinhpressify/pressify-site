<script setup lang="ts">
const { t } = useI18n();

const noTrackingRowKeys = ["pending_payment", "processing", "priority"] as const;

/** Đã có tracking: Platform label = 3 rows, Pressify label = 4 rows */
const trackingRows = [
  { key: "platform_transit", subGroup: "platform", subGroupRowspan: 3, isFirstInSubGroup: true, isFirstInTracking: true },
  { key: "platform_wrong_address", subGroup: "platform", subGroupRowspan: 3, isFirstInSubGroup: false, isFirstInTracking: false },
  { key: "platform_info_received", subGroup: "platform", subGroupRowspan: 3, isFirstInSubGroup: false, isFirstInTracking: false },
  { key: "pressify_delivered_not_received", subGroup: "pressify", subGroupRowspan: 4, isFirstInSubGroup: true, isFirstInTracking: false },
  { key: "pressify_tracking_issues", subGroup: "pressify", subGroupRowspan: 4, isFirstInSubGroup: false, isFirstInTracking: false },
  { key: "pressify_cancel_after_paid", subGroup: "pressify", subGroupRowspan: 4, isFirstInSubGroup: false, isFirstInTracking: false },
  { key: "pressify_tiktok_cancel", subGroup: "pressify", subGroupRowspan: 4, isFirstInSubGroup: false, isFirstInTracking: false },
] as const;

const trackingRowCount = trackingRows.length;

const producedRowKeys = ["wrong_color", "wrong_size", "cancel_pre_shipment"] as const;
const producedRowspan = producedRowKeys.length;

/** Chính sách hỗ trợ — Gói quà chiếm 2 row */
const supportRows = [
  { key: "faulty_order", isFirstInSupport: true, isGiftRow: false, isFirstGiftRow: false },
  { key: "support_case", isFirstInSupport: false, isGiftRow: false, isFirstGiftRow: false },
  { key: "images", isFirstInSupport: false, isGiftRow: false, isFirstGiftRow: false },
  { key: "account_appeal", isFirstInSupport: false, isGiftRow: false, isFirstGiftRow: false },
  { key: "gift_paper", isFirstInSupport: false, isGiftRow: true, isFirstGiftRow: true },
  { key: "gift_box", isFirstInSupport: false, isGiftRow: true, isFirstGiftRow: false },
] as const;

const supportRowCount = supportRows.length;

const noteRowKeys = ["tracking", "faulty", "shipping"] as const;
</script>

<template>
  <div class="tos-tables">
  <div class="tos-cancel-table">
    <div class="tos-cancel-table__scroll" tabindex="0">
      <table class="tos-cancel-table__table">
        <caption class="sr-only">
          {{ t("tos.cancelTable.caption") }}
        </caption>
        <thead>
          <tr>
            <th scope="col">{{ t("tos.cancelTable.headers.orderGroup") }}</th>
            <th scope="col">{{ t("tos.cancelTable.headers.status") }}</th>
            <th scope="col">{{ t("tos.cancelTable.headers.content") }}</th>
            <th scope="col">{{ t("tos.cancelTable.headers.policy") }}</th>
            <th scope="col">{{ t("tos.cancelTable.headers.refund") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(key, index) in noTrackingRowKeys" :key="key">
            <th
              v-if="index === 0"
              scope="rowgroup"
              :rowspan="noTrackingRowKeys.length"
              class="tos-cancel-table__group"
            >
              {{ t("tos.cancelTable.groupNoTracking") }}
            </th>
            <td class="tos-cancel-table__status">
              {{ t(`tos.cancelTable.rows.${key}.status`) }}
            </td>
            <td>{{ t(`tos.cancelTable.rows.${key}.content`) }}</td>
            <td>{{ t(`tos.cancelTable.rows.${key}.policy`) }}</td>
            <td class="tos-cancel-table__refund">
              {{ t(`tos.cancelTable.rows.${key}.refund`) }}
            </td>
          </tr>

          <tr v-for="row in trackingRows" :key="row.key">
            <th
              v-if="row.isFirstInTracking"
              scope="rowgroup"
              :rowspan="trackingRowCount"
              class="tos-cancel-table__group"
            >
              {{ t("tos.cancelTable.groupHasTracking") }}
            </th>
            <th
              v-if="row.isFirstInSubGroup"
              scope="row"
              :rowspan="row.subGroupRowspan"
              class="tos-cancel-table__status tos-cancel-table__status--group"
            >
              {{ t(`tos.cancelTable.subGroups.${row.subGroup}`) }}
            </th>
            <td>{{ t(`tos.cancelTable.trackingRows.${row.key}.content`) }}</td>
            <td>{{ t(`tos.cancelTable.trackingRows.${row.key}.policy`) }}</td>
            <td class="tos-cancel-table__refund">
              {{ t(`tos.cancelTable.trackingRows.${row.key}.refund`) }}
            </td>
          </tr>

          <!-- Đơn đã sản xuất: cột 1 & 5 trống; cột 2 & 4 rowspan 3 -->
          <tr
            v-for="(key, index) in producedRowKeys"
            :key="key"
            class="tos-cancel-table__row--produced"
          >
            <td class="tos-cancel-table__empty border-b-none" />
            <th
              v-if="index === 0"
              scope="row"
              :rowspan="producedRowspan"
              class="tos-cancel-table__status tos-cancel-table__status--group"
            >
              {{ t("tos.cancelTable.producedSection.status") }}
            </th>
            <td>{{ t(`tos.cancelTable.producedSection.rows.${key}.content`) }}</td>
            <td
              v-if="index === 0"
              :rowspan="producedRowspan"
              class="tos-cancel-table__policy-merged"
            >
              {{ t("tos.cancelTable.producedSection.policy") }}
            </td>
            <td class="tos-cancel-table__empty" />
          </tr>

          <!-- Chính sách hỗ trợ -->
          <tr
            v-for="row in supportRows"
            :key="row.key"
            class="tos-cancel-table__row--support"
          >
            <th
              v-if="row.isFirstInSupport"
              scope="rowgroup"
              :rowspan="supportRowCount"
              class="tos-cancel-table__group tos-cancel-table__group--support"
            >
              {{ t("tos.cancelTable.supportSection.group") }}
            </th>
            <th
              v-if="!row.isGiftRow"
              scope="row"
              class="tos-cancel-table__status"
            >
              {{ t(`tos.cancelTable.supportSection.rows.${row.key}.status`) }}
            </th>
            <th
              v-else-if="row.isFirstGiftRow"
              scope="row"
              rowspan="2"
              class="tos-cancel-table__status tos-cancel-table__status--group"
            >
              {{ t("tos.cancelTable.supportSection.statuses.gift_wrap") }}
            </th>
            <td>{{ t(`tos.cancelTable.supportSection.rows.${row.key}.content`) }}</td>
            <td class="tos-cancel-table__policy-merged">
              {{ t(`tos.cancelTable.supportSection.rows.${row.key}.policy`) }}
            </td>
            <td class="tos-cancel-table__refund">
              {{ t(`tos.cancelTable.supportSection.rows.${row.key}.refund`) }}
            </td>
          </tr>

          <tr class="tos-cancel-table__row--support-footer">
            <td colspan="5" class="tos-cancel-table__footer-notes">
              {{ t("tos.cancelTable.supportSection.footerNotes") }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="tos-note-table">
    <div class="tos-note-table__scroll">
      <table class="tos-note-table__table">
        <caption class="sr-only">
          {{ t("tos.cancelTable.noteTable.title") }}
        </caption>
        <thead>
          <tr>
            <th scope="col">{{ t("tos.cancelTable.noteTable.title") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="key in noteRowKeys" :key="key">
            <td>{{ t(`tos.cancelTable.noteTable.rows.${key}`) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  </div>
</template>

<style scoped lang="scss">
.tos-tables {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.tos-cancel-table {
  margin-bottom: 0;

  &__scroll {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    border: 1px solid rgb(0 0 0 / 0.08);
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.04);
  }

  &__table {
    width: 100%;
    min-width: 880px;
    border-collapse: collapse;
    font-size: 0.875rem;
    line-height: 1.55;
    color: rgb(0 0 0 / 0.85);

    th,
    td {
      padding: 0.875rem 1rem;
      border-bottom: 1px solid rgb(0 0 0 / 0.06);
      vertical-align: top;
      text-align: left;
    }

    thead th {
      background: rgb(0 0 0 / 0.03);
      font-size: 0.8125rem;
      font-weight: 600;
      color: rgb(0 0 0 / 0.7);
      white-space: nowrap;
    }

    tbody tr.tos-cancel-table__row--produced td,
    tbody tr.tos-cancel-table__row--produced th {
      background: rgb(139 92 246 / 0.06);
    }

    tbody tr.tos-cancel-table__row--support td,
    tbody tr.tos-cancel-table__row--support th {
      background: rgb(59 130 246 / 0.06);
    }

    tbody tr.tos-cancel-table__row--support-footer td {
      background: rgb(59 130 246 / 0.08);
      border-bottom: none;
    }
  }

  &__empty {
    width: 8.5rem;
    min-width: 8.5rem;
    background: transparent;
    border-bottom: none;
  }

  &__policy-merged {
    vertical-align: top;
    white-space: pre-line;
  }

  &__footer-notes {
    font-size: 0.8125rem;
    line-height: 1.6;
    white-space: pre-line;
    color: rgb(0 0 0 / 0.8);
  }

  &__group {
    width: 8.5rem;
    min-width: 8.5rem;
    font-weight: 600;
    text-align: center;
    vertical-align: middle;
    background: rgb(from var(--color-orange) r g b / 0.06);
    color: var(--color-title-section, #111);
    border-right: 1px solid rgb(0 0 0 / 0.06);

    &--support {
      background: rgb(59 130 246 / 0.1);
    }
  }

  &__status {
    font-weight: 600;
    color: var(--color-title-section, #111);

    &--group {
      width: 11rem;
      min-width: 11rem;
      vertical-align: middle;
      text-align: center;
      background: rgb(0 0 0 / 0.02);
      border-right: 1px solid rgb(0 0 0 / 0.06);
    }
  }

  &__refund {
    width: 5.5rem;
    font-weight: 600;
    white-space: nowrap;
    text-align: center;
    color: var(--color-orange);
  }
}

.tos-note-table {
  &__scroll {
    overflow-x: auto;
    border: 1px solid rgb(0 0 0 / 0.08);
    border-radius: 12px;
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.04);
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
    line-height: 1.55;
    color: rgb(0 0 0 / 0.85);

    th,
    td {
      padding: 0.875rem 1rem;
      border-bottom: 1px solid rgb(0 0 0 / 0.08);
      text-align: left;
    }

    thead th {
      text-align: center;
      font-weight: 700;
      font-size: 0.9375rem;
      background: rgb(6 182 212 / 0.2);
      color: var(--color-title-section, #111);
    }

    tbody tr:last-child td {
      border-bottom: none;
    }

    tbody td {
      background: rgb(6 182 212 / 0.1);
    }
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
