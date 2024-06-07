-- CreateTable
CREATE TABLE "plants" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "plantTypeId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "planting_date" TIMESTAMP(3) NOT NULL,
    "current_status" TEXT NOT NULL,
    "soil_type" TEXT NOT NULL,

    CONSTRAINT "plants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "humidity" DOUBLE PRECISION NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "light" DOUBLE PRECISION NOT NULL,
    "nutrient_level" DOUBLE PRECISION NOT NULL,
    "plantId" UUID NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plant_types" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "type_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "optimal_humidity" DOUBLE PRECISION NOT NULL,
    "optimal_temperature" DOUBLE PRECISION NOT NULL,
    "optimal_light" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "plant_types_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "plants" ADD CONSTRAINT "plants_plantTypeId_fkey" FOREIGN KEY ("plantTypeId") REFERENCES "plant_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plants" ADD CONSTRAINT "plants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data" ADD CONSTRAINT "data_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "plants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
