-- CreateTable
CREATE TABLE "Route" (
    "id" TEXT NOT NULL,
    "route_id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "ghg_intensity" DOUBLE PRECISION NOT NULL,
    "is_baseline" BOOLEAN NOT NULL DEFAULT false,
    "vesselType" TEXT NOT NULL,
    "fuelType" TEXT NOT NULL,
    "fuelConsumption" DOUBLE PRECISION NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "totalEmissions" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShipCompliance" (
    "id" TEXT NOT NULL,
    "ship_id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "cb_gco2eq" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ShipCompliance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankEntry" (
    "id" TEXT NOT NULL,
    "ship_id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "amount_gco2eq" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BankEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pool" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PoolMember" (
    "id" TEXT NOT NULL,
    "pool_id" TEXT NOT NULL,
    "ship_id" TEXT NOT NULL,
    "cb_before" DOUBLE PRECISION NOT NULL,
    "cb_after" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PoolMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Route_route_id_key" ON "Route"("route_id");

-- CreateIndex
CREATE UNIQUE INDEX "ShipCompliance_ship_id_year_key" ON "ShipCompliance"("ship_id", "year");

-- CreateIndex
CREATE UNIQUE INDEX "PoolMember_pool_id_ship_id_key" ON "PoolMember"("pool_id", "ship_id");

-- AddForeignKey
ALTER TABLE "PoolMember" ADD CONSTRAINT "PoolMember_pool_id_fkey" FOREIGN KEY ("pool_id") REFERENCES "Pool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
