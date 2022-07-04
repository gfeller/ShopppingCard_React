export interface NewDTO {
  id?: string;
}

export interface DTO  {
  id?: string;
}

export interface StoreDto<T extends DTO> extends DTO {
  id: string;
  item?: T;
  isLoading: boolean;
  hasError: boolean;
}
