-- CreateTable
CREATE TABLE "clusters" (
    "cluster_id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "multi_tenant" BOOLEAN NOT NULL DEFAULT true,
    "isactive" BOOLEAN DEFAULT true,
    "created_at" TEXT NOT NULL DEFAULT '',
    "updated_at" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "clusters_pkey" PRIMARY KEY ("cluster_id")
);

-- CreateTable
CREATE TABLE "collections" (
    "collection_id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "cluster_id" UUID,
    "name" VARCHAR NOT NULL,
    "created_at" TEXT NOT NULL DEFAULT '',
    "updated_at" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "collections_pkey" PRIMARY KEY ("collection_id")
);

-- CreateTable
CREATE TABLE "documents" (
    "document_id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" UUID,
    "collection_id" UUID,
    "cluster_id" UUID,
    "data" JSONB NOT NULL DEFAULT '{}',
    "collection_name" VARCHAR,
    "created_at" TEXT NOT NULL DEFAULT '',
    "updated_at" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "documents_pkey" PRIMARY KEY ("document_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "cluster_id" UUID,
    "data" JSONB NOT NULL DEFAULT '{}',
    "created_at" TEXT NOT NULL DEFAULT '',
    "updated_at" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clusters_email_key" ON "clusters"("email");

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_cluster_id_fkey" FOREIGN KEY ("cluster_id") REFERENCES "clusters"("cluster_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_cluster_id_fkey" FOREIGN KEY ("cluster_id") REFERENCES "clusters"("cluster_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collections"("collection_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_cluster_id_fkey" FOREIGN KEY ("cluster_id") REFERENCES "clusters"("cluster_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
