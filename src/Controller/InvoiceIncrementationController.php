<?php

namespace App\Controller;

use App\Entity\Invoice;
use Doctrine\ORM\EntityManagerInterface;

class InvoiceIncrementationController
{
    /**
     * 
     * @var EntityManagerInterface
     */
    private $manager;

    /**
     * 
     * @param EntityManagerInterface $manager 
     * @return void 
     */
    public function __construct(EntityManagerInterface $manager)
    {
        $this->manager = $manager;
    }

    /**
     * 
     * @param Invoice $data 
     * @return Invoice 
     */
    public function __invoke(Invoice $data)
    {
        // ATTENTION : cette variable DOIT ABSOLUMENT se nommer $data !!!
        $data->setChrono($data->getChrono() + 1);
        $this->manager->flush();
        return $data;
    }
}
