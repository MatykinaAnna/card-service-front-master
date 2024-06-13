export interface BlockData {
  id: number
  block_data: string //строка base64 изображения с сервера или загруженная пользователем
  url_block_data?: string //адрес загруженного изображения с сервера
  created?: boolean // изображение загружено с сервера?
  update?: boolean // изображение было изменено?
  order_num: number
}
export interface BlockDataFront {
  id: number
  block_data: File
  order_num: number
}
export interface DescItem {
  id: number
  name_string_id: number
  order_num: number
  card_item: number | null
  block_type: number
  string: string
}
export interface Block_description_result {
  id: number
  block_text: string
  block_description_item: DescItem
  card_result: number | null
  block_data: BlockData[]
  order_num: number
  changed?: boolean
  sizeOfImg?: number
  block_insert_data_type: number | null
}

export interface dropdownOption {
  id: number
  short_name_string_id?: string
  string?: string
}

export interface Modalities_CardService {
  id: number
  short_name_string_id: string
  full_name_string_id: string
  order_num: number
}

export interface ConfirmWindowProps {
  text: string
  onTrickClick: (clickBtn: string) => void
}
