## Database Tables

### Konsep

- `job`: pekerjaan yang dibuat oleh customer dan dapat diambil/di-apply oleh driver
- `offer`: pekerjaan yang dibuat oleh driver dan dapat diambil/di-apply oleh customer

### Definisi Table

- `single_jobs`: pekerjaan dari customer dan dapat diambil oleh 1 driver
- `multi_jobs`: pekerjaan dari customer dan dapat diambil oleh 1 driver, serta customer lain dapat ikut (follow)

- `single_offer`: pekerjaan dari driver dan dapat diambil oleh 1 customer
- `single_offer_applicants`: lamaran dari customer untuk pekerjaan driver, terdapat kolom max_applicants untuk menentukan jumlah maksimal lamaran yang dapat diterima oleh driver, jasa-titip = 1, antar-jemput bisa >=1