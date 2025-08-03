import { z } from 'zod'

import { PlayerPosition } from '~/constants/enum'

export const playerSchema = z.object({
  name: z.string().min(1, 'Tên cầu thủ là bắt buộc.'),
  shirtNumber: z.string('Số áo cầu thủ là bắt buộc.').regex(/^[1-9][0-9]?$/, 'Số áo phải là một số từ 1 đến 99.'),
  position: z.enum(
    [
      PlayerPosition.Gk.toString(),
      PlayerPosition.Df.toString(),
      PlayerPosition.Mf.toString(),
      PlayerPosition.Fw.toString()
    ],
    'Vị trí thi đấu không hợp lệ.'
  ),
  nationId: z.string('Vui lòng chọn quốc tịch.'),
  leagueId: z.string('Vui lòng chọn giải đấu.'),
  teamId: z.string('Vui lòng chọn câu lạc bộ.'),
  dateOfBirth: z.date('Ngày không hợp lệ.')
})

export const createPlayerSchema = playerSchema.pick({
  leagueId: true,
  name: true,
  nationId: true,
  position: true,
  shirtNumber: true,
  teamId: true,
  dateOfBirth: true
})

export type CreatePlayerSchema = z.infer<typeof createPlayerSchema>
