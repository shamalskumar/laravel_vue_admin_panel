<script setup lang="ts">
import { basicTableData1 } from '@/_mockApis/components/table/basicTables';
</script>
<template>
    <v-card class="border" elevation="0">
        <v-table class="month-table">
            <thead>
                <tr>
                    <th class="text-h6 ps-6">Users</th>
                    <th class="text-h6">Project Name</th>
                    <th class="text-h6">Team</th>
                    <th class="text-h6">Status</th>
                    <th class="text-h6">Budget</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in basicTableData1" :key="item.name" class="month-item">
                    <td class="ps-6">
                        <div class="d-flex gap-3 align-center">
                            <v-avatar size="40">
                                <img :src="item.avatar" alt="avatar" height="40" />
                            </v-avatar>
                            <div>
                                <h6 class="text-h6">{{ item.name }}</h6>
                                <div class="textSecondary text-body-1">{{ item.post }}</div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <p class="text-16 textPrimary">{{ item.pname }}</p>
                    </td>
                    <td>
                        <div class="d-flex align-center">
                            <div class="ml-2 d-flex flex-row-reverse">
                                <v-avatar
                                    v-for="team in item.teams"
                                    :key="team.id"
                                    size="35"
                                    :class="'ml-n2 avtar-border bg-' + team.color"
                                >
                                    {{ team.text }}
                                </v-avatar>
                            </div>
                        </div>
                    </td>
                    <td>
                        <v-chip rounded="sm" class="font-weight-bold" :color="item.statuscolor" size="small" label>{{
                            item.status
                        }}</v-chip>
                    </td>
                    <td>
                        <h6 class="text-h6">{{ item.budget }}</h6>
                    </td>
                </tr>
            </tbody>
        </v-table>
    </v-card>
</template>
